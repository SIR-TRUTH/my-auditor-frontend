import type { NextApiRequest, NextApiResponse } from 'next';
import { readStore, writeStore } from '../../../lib/authEngine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { businessName, tradingName, industry, country, currency, branchName, address } = req.body;

    if (!businessName || !branchName) {
      return res.status(400).json({ message: 'Business Name and Branch Name are required.' });
    }

    const businesses = readStore('businesses.json');
    const newBusiness = {
      id: 'biz_' + Date.now(),
      businessName,
      tradingName: tradingName || '',
      industry,
      country,
      currency,
      createdAt: new Date().toISOString(),
    };
    businesses.push(newBusiness);
    writeStore('businesses.json', businesses);

    const branches = readStore('branches.json');
    const newBranch = {
      id: 'br_' + Date.now(),
      businessId: newBusiness.id,
      branchName,
      address: address || '',
      createdAt: new Date().toISOString(),
    };
    branches.push(newBranch);
    writeStore('branches.json', branches);

    return res.status(200).json({
      success: true,
      message: 'Business and branch created successfully.',
      businessId: newBusiness.id,
      branchId: newBranch.id,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}