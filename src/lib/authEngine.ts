import crypto from 'crypto';

// In-memory fallback store for serverless environments like Vercel where local disk writes are restricted
const memoryStore: Record<string, any[]> = {
  'users.json': [],
  'otps.json': [],
  'businesses.json': [],
  'branches.json': [],
  'memberships.json': [],
};

export function hashPassword(password: string): string {
  const salt = 'my-auditor-enterprise-salt-key';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export function readStore(filename: string): any[] {
  try {
    return memoryStore[filename] || [];
  } catch (e) {
    return [];
  }
}

export function writeStore(filename: string, data: any[]) {
  try {
    memoryStore[filename] = data;
  } catch (e) {
    // Ignore read-only filesystem errors on serverless
  }
}