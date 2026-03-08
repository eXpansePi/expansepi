import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';

// Simple in-memory rate limiter (per-instance; resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export async function POST(req: Request) {
  try {
    // CSRF: verify request origin
    const headersList = await headers();
    const origin = headersList.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || 'https://expansepi.com',
      'http://localhost:3000',
    ];
    if (!origin || !allowedOrigins.some(allowed => origin === allowed)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Rate limiting
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Příliš mnoho požadavků. Zkuste to později.' },
        { status: 429 }
      );
    }

    const body = await req.json();
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
    if (!name || !email || !subject || !message) {
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 4. Sanitization for HTML context (Prevent HTML Injection/XSS in email client)
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : '';
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const mailOptions = {
      from: `"Nová Poptávka" <info@expansepi.com>`,
      to: 'info@expansepi.com',
      replyTo: email,
      subject: `${safeSubject} (od: ${safeName})`,
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
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Email byl úspěšně odeslán.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Nepodařilo se odeslat email.',
      },
      { status: 500 }
    );
  }
}
