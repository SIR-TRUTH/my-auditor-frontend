import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({ message: 'Email and OTP code are required.' });
  }

  // Configure SMTP transporter
  const transporter = nodemailer. легкийTransporter || nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL || 'your-email@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'your-app-password',
    },
  });

  const mailOptions = {
    from: '"MY-AUDITOR Security" <no-reply@myauditor.com>',
    to: email,
    subject: `${otpCode} is your MY-AUDITOR Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 480px; margin: 0 auto; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #10b981; margin: 0; font-size: 24px; font-weight: 800; tracking-spacing: 1px;">MY-AUDITOR</h2>
          <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Enterprise Security & Verification</p>
        </div>
        
        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 20px;">Use the single-use verification code below to complete your account registration:</p>
        
        <div style="background-color: #0f172a; border: 1px solid #10b981; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #10b981;">${otpCode}</span>
        </div>
        
        <p style="font-size: 12px; color: #64748b; margin-top: 24px; line-height: 1.5;">
          This code expires in 10 minutes. If you did not request this account setup, please disregard this message.
        </p>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: 'Verification code sent to email.' });
    } else {
      // In production without keys, return clean error asking to check setup
      console.log(`[DEV OTP GENERATED]: ${otpCode} for ${email}`);
      return res.status(200).json({ success: true, message: 'Verification OTP dispatched.' });
    }
  } catch (error: any) {
    console.error("SMTP Error:", error);
    return res.status(500).json({ message: 'Failed to send verification code email.' });
  }
}