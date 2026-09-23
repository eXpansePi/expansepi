import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { FixedWindowRateLimiter, consumeWithCeiling } from '@/lib/rate-limit';
import { getTrustedClientIp } from '@/lib/request-identity';
import { sendTransactionalEmail } from '@/lib/mailer';

const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Primary control: one bucket per client. Identifying a client needs a trusted
 * proxy, so it is paired with a per-instance ceiling that still applies when no
 * identity is available.
 */
const perClientLimiter = new FixedWindowRateLimiter({ limit: 5, windowMs: RATE_LIMIT_WINDOW_MS });

/**
 * Blast-radius ceiling, set far above plausible human traffic so it never
 * rejects real enquiries while bounding what one instance can be made to send.
 */
const instanceLimiter = new FixedWindowRateLimiter({ limit: 60, windowMs: RATE_LIMIT_WINDOW_MS, maxEntries: 1 });

const UNIDENTIFIED_CLIENT = 'unidentified';
const INSTANCE_BUCKET = 'instance';

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/** Header values must not be able to introduce additional headers. */
const hasControlCharacters = (value: string) => /[\r\n\u0000]/.test(value);

const tooManyRequests = (retryAfterSeconds: number) =>
  NextResponse.json(
    { error: 'Příliš mnoho požadavků. Zkuste to později.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
  );

export async function POST(req: Request) {
  try {
    // CSRF: verify request origin
    const headersList = await headers();
    const origin = headersList.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com',
    ];
    const requestUrl = new URL(req.url);
    if (process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(requestUrl.hostname)) {
      allowedOrigins.push(requestUrl.origin);
    }
    if (!origin || !allowedOrigins.some(allowed => origin === allowed)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Rate limiting
    const clientIp = getTrustedClientIp(headersList);
    const rateLimit = consumeWithCeiling(perClientLimiter, instanceLimiter, clientIp ?? UNIDENTIFIED_CLIENT, INSTANCE_BUCKET);
    if (!rateLimit.allowed) return tooManyRequests(rateLimit.retryAfterSeconds);

    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 });
    }
    const { name, email, phone, subject, message, surname } = body;

    // 0. Honeypot check for bots
    if (surname) {
      // Return success to trick the bot, but do nothing
      return NextResponse.json(
        { success: true, message: 'Email byl úspěšně odeslán.' },
        { status: 200 }
      );
    }

    // 1. Basic Validation (Input presence)
    if ([name, email, subject, message].some(value => typeof value !== 'string' || !value.trim())) {
      return NextResponse.json(
        { error: 'Chybí povinná pole.' },
        { status: 400 }
      );
    }

    // 2. Length Validation (Prevent massive payloads)
    if (name.length > 100) return NextResponse.json({ error: 'Jméno je příliš dlouhé.' }, { status: 400 });
    if (email.length > 100) return NextResponse.json({ error: 'Email je příliš dlouhý.' }, { status: 400 });
    if (subject.length > 200) return NextResponse.json({ error: 'Předmět je příliš dlouhý.' }, { status: 400 });
    if (message.length > 5000) return NextResponse.json({ error: 'Zpráva je příliš dlouhá.' }, { status: 400 });

    // 3. Email Format Validation (RFC 5322 simplified)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email) || email.length < 5) {
      return NextResponse.json({ error: 'Neplatný formát emailu nebo příliš krátký.' }, { status: 400 });
    }

    // 4. Phone validation (explicit field)
    if (phone) {
      if (typeof phone !== 'string' || phone.length > 20) {
        return NextResponse.json({ error: 'Neplatný formát telefonního čísla.' }, { status: 400 });
      }
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json({ error: 'Neplatný formát telefonního čísla.' }, { status: 400 });
      }
    }

    // 5. Reject header injection before these values reach subject/replyTo.
    if ([name, subject].some(hasControlCharacters)) {
      return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 });
    }

    // 6. Sanitization for HTML context (Prevent HTML Injection/XSS in email client)
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : '';
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    await sendTransactionalEmail({
      // The subject is a header, not markup, so it carries the raw text.
      subject: `${subject} (od: ${name})`,
      replyTo: email,
      text: `Jméno: ${name}\nEmail: ${email}${phone ? `\nTelefon: ${phone}` : ''}\nPředmět: ${subject}\n\nZpráva:\n${message}`,
      html: `
        <h3>Nová zpráva z kontaktního formuláře</h3>
        <p><strong>Jméno:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        ${safePhone ? `<p><strong>Telefon:</strong> ${safePhone}</p>` : ''}
        <p><strong>Předmět:</strong> ${safeSubject}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Email byl úspěšně odeslán.' },
      { status: 200 }
    );
  } catch (error) {
    // Log the failure shape only: provider errors can carry credentials or
    // enquirer data, and neither belongs in platform logs.
    console.error('Contact form delivery failed:', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json(
      {
        success: false,
        error: 'Nepodařilo se odeslat email.',
      },
      { status: 500 }
    );
  }
}
