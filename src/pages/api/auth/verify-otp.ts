import type { NextApiRequest, NextApiResponse } from 'next';
import { readStore, writeStore } from '../../../lib/authEngine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const otps = readStore('otps.json');
    const validOtpRecord = otps.find(o => o.email.toLowerCase() === email.toLowerCase() && o.code === otp);

    if (!validOtpRecord || validOtpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    const users = readStore('users.json');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.verified = true;
      writeStore('users.json', users);
    }

    const remainingOtps = otps.filter(o => o.email.toLowerCase() !== email.toLowerCase());
    writeStore('otps.json', remainingOtps);

    return res.status(200).json({ success: true, message: 'Account verified successfully.' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}