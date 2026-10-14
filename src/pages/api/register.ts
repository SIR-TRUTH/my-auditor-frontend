import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Forward the registration request directly to the Express backend server
  fetch('http://127.0.0.1:3000/api/businesses/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  })
    .then(async (backendRes) => {
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    })
    .catch((err) => {
      console.error('Next.js proxy error:', err);
      return res.status(500).json({ message: 'Failed to reach backend server on port 3000.' });
    });
}