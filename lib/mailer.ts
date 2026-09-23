/**
 * Transactional email transport.
 *
 * Resend is preferred because its API keys are scoped to sending and can be
 * revoked independently. The SMTP path remains so the contact form keeps
 * working on deployments that have not migrated yet, but a mailbox app
 * password grants far more than sending rights and should be retired.
 *
 * @module lib/mailer
 */

export interface OutboundEmail {
  readonly subject: string
  readonly replyTo: string
  readonly text: string
  readonly html: string
}

export class MailerNotConfiguredError extends Error {
  constructor() {
    super("No transactional email provider is configured")
    this.name = "MailerNotConfiguredError"
  }
}

const SENDER = '"eXpansePi" <info@expansepi.com>'
const RECIPIENT = "info@expansepi.com"

export function getConfiguredProvider(env: NodeJS.ProcessEnv = process.env): "resend" | "smtp" | null {
  if (env.RESEND_API_KEY) return "resend"
  if (env.GMAIL_USER && env.GMAIL_PASS) return "smtp"
  return null
}

export async function sendTransactionalEmail(email: OutboundEmail): Promise<void> {
  const provider = getConfiguredProvider()
  if (provider === "resend") return sendViaResend(email)
  if (provider === "smtp") return sendViaSmtp(email)
  throw new MailerNotConfiguredError()
}

async function sendViaResend(email: OutboundEmail): Promise<void> {
  const { Resend } = await import("resend")
  const client = new Resend(process.env.RESEND_API_KEY)
  const { error } = await client.emails.send({
    from: SENDER,
    to: RECIPIENT,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
  // The SDK reports delivery failures in the payload rather than by throwing.
  if (error) throw new Error(`Resend rejected the message: ${error.name}`)
}

async function sendViaSmtp(email: OutboundEmail): Promise<void> {
  const nodemailer = (await import("nodemailer")).default
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  })
  await transporter.sendMail({
    from: SENDER,
    to: RECIPIENT,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
}
