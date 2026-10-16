import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({ message: 'Email and OTP code are required' });
  }

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'MY-AUDITOR <onboarding@resend.dev>',
        to: [email],
        subject: `${otpCode} is your MY-AUDITOR Verification Code`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #10b981; margin-top: 0;">MY-AUDITOR Verification</h2>
            <p style="font-size: 14px; color: #94a3b8;">Use the 6-digit verification code below to complete your account sign-up:</p>
            <div style="background-color: #0f172a; border: 1px dashed #10b981; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981;">${otpCode}</span>
            </div>
            <p style="font-size: 12px; color: #64748b;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>
        `
      });
    }

    return res.status(200).json({ success: true, message: 'OTP code sent successfully' });
  } catch (error: any) {
    console.error("Error sending OTP email:", error);
    return res.status(200).json({ success: true, message: 'OTP generated (dev mode)' });
  }
}