import type { NextApiRequest, NextApiResponse } from 'next';
import { readStore, writeStore, hashPassword } from '../../../lib/authEngine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const users = readStore('users.json');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return res.status(400).json({ message: 'An account with this business email already exists.' });
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName,
      email: email.toLowerCase(),
      phone,
      passwordHash: hashPassword(password),
      role: 'OWNER',
      verified: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeStore('users.json', users);

    const otps = readStore('otps.json');
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    otps.push({
      email: email.toLowerCase(),
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    writeStore('otps.json', otps);

    return res.status(200).json({
      success: true,
      message: 'Account created successfully. OTP generated.',
      devOtp: otpCode,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}