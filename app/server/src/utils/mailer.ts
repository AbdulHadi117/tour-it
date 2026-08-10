import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (env.NODE_ENV === "development") {
    // In development, skip real delivery and log to console so the app is
    // fully usable without a Resend account. Set RESEND_API_KEY in .env
    // to enable real delivery in development too.
    if (!env.RESEND_API_KEY) {
      // eslint-disable-next-line no-console
      console.log(`[mailer] DEV — would send to=${to} subject="${subject}"`);
      // eslint-disable-next-line no-console
      console.log(`[mailer] HTML:\n${html}`);
      return;
    }
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    // Treat delivery failure as a non-fatal server error so the caller can
    // still succeed or handle retries — but always surface it to the logs.
    // eslint-disable-next-line no-console
    console.error("[mailer] Resend delivery error:", error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}
