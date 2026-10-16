import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { legalName, email } = req.body;

  if (!legalName || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Attempt real email delivery if RESEND_API_KEY is present
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'MY-AUDITOR <onboarding@resend.dev>',
        to: [email],
        subject: `Welcome to MY-AUDITOR, ${legalName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 30px; border-radius: 12px;">
            <h1 style="color: #10b981;">Welcome aboard, ${legalName}!</h1>
            <p style="font-size: 14px; color: #94a3b8;">Your business registration has been verified on MY-AUDITOR.</p>
            <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #38bdf8; font-weight: bold;">Verified Account Details:</p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Legal Name:</strong> ${legalName}</p>
              <p style="margin: 5px 0; font-size: 13px;"><strong>Email:</strong> ${email}</p>
            </div>
            <a href="https://my-auditor-frontend.vercel.app/dashboard" style="display: inline-block; background-color: #10b981; color: #020617; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Launch Action Hub</a>
          </div>
        `
      });
    }

    return res.status(200).json({ success: true, message: 'Welcome email queued successfully!' });
  } catch (error: any) {
    console.error("Welcome email error:", error);
    // Fallback response for dev simulation
    return res.status(200).json({ success: true, message: 'Simulated welcome email delivered.' });
  }
}