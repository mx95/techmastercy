import nodemailer from "nodemailer";
import { getSmtpConfig, siteConfig } from "@/lib/config";

export type SendEmailResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: string };

export async function sendBusinessEmail(options: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<SendEmailResult> {
  const smtp = getSmtpConfig();
  if (!smtp) {
    return {
      sent: false,
      reason:
        "SMTP is not configured. Enquiry was stored; configure SMTP_* environment variables to enable email delivery.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
    });

    const info = await transporter.sendMail({
      from: smtp.from,
      to: siteConfig.businessEmail,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
    });

    return { sent: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown SMTP error";
    return { sent: false, reason: `Email delivery failed: ${message}` };
  }
}
