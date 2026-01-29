import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
    const body = await req.json();
    const { name, email, subject, message } = body;

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

    // 3. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Neplatný formát emailu.' }, { status: 400 });
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
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'info@expansepi.com',
      replyTo: email, // Nodemailer handles basic header sanitization
      subject: `${safeSubject} (od: ${safeName})`,
      text: `Jméno: ${name}\nEmail: ${email}\nPředmět: ${subject}\n\nZpráva:\n${message}`, // Plain text is safe
      html: `
        <h3>Nová zpráva z kontaktního formuláře</h3>
        <p><strong>Jméno:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
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
      { error: 'Nepodařilo se odeslat email.' },
      { status: 500 }
    );
  }
}
