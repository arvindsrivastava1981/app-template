import { Resend } from "resend";

function client() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail({ to, subject, html }) {
  const c = client();
  if (!c) {
    console.info(`[email] (mail disabled) to=${to} subject=${subject}`);
    return { ok: true, debug: true };
  }
  const { data, error } = await c.emails.send({
    from: process.env.EMAIL_FROM || "App Template <no-reply@yourdomain.in>",
    to,
    subject,
    html,
  });
  if (error) {
    console.error("[email] send failed:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data?.id };
}