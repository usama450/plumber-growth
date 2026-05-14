import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Missing RESEND_API_KEY environment variable");
    _resend = new Resend(key);
  }
  return _resend;
}

export const resend = {
  emails: {
    send: (...args: Parameters<Resend["emails"]["send"]>) =>
      getResend().emails.send(...args),
  },
};

export const FROM_EMAIL = "Khwab <orders@khwab.ca>";
export const SUPPORT_EMAIL = "support@khwab.ca";
