import type { NextApiRequest, NextApiResponse } from 'next';
import { readStore, writeStore } from '../../../lib/authEngine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const otps = readStore('otps.json');
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Filter out existing OTPs for this email and add new one
    const updatedOtps = otps.filter(o => o.email.toLowerCase() !== email.toLowerCase());
    updatedOtps.push({
      email: email.toLowerCase(),
      code: newOtpCode,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    
    writeStore('otps.json', updatedOtps);

    return res.status(200).json({
      success: true,
      message: 'A new verification code has been generated.',
      devOtp: newOtpCode,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}