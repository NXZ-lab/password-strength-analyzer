import crypto from 'crypto';
import { env } from '../config/env';

export const checkPwnedPassword = async (password: string) => {
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await fetch(`${env.hibpApiBaseUrl}/${prefix}`, {
    headers: {
      'Add-Padding': 'true',
      'User-Agent': 'password-strength-analyzer',
    },
  });

  if (!response.ok) {
    throw new Error('Have I Been Pwned API request failed.');
  }

  const text = await response.text();
  const match = text
    .split('\n')
    .map((line) => line.trim().split(':'))
    .find(([candidateSuffix]) => candidateSuffix === suffix);

  return {
    breached: Boolean(match),
    count: match ? Number(match[1]) : 0,
  };
};
