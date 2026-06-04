import { Request, Response } from 'express';
import { PasswordHistory } from '../models/PasswordHistory';
import { checkPwnedPassword } from '../services/breachService';
import { hashPassword, verifyPassword } from '../utils/hash';

export const breachCheck = async (req: Request, res: Response) => {
  const { password } = req.body as { password: string };
  const result = await checkPwnedPassword(password);
  return res.status(200).json(result);
};

export const analyzeAndStore = async (req: Request, res: Response) => {
  const { password, score, label } = req.body as { password: string; score: number; label: string };
  const userId = req.user!.userId;

  const lastTen = await PasswordHistory.find({ userId }).sort({ createdAt: -1 }).limit(10);
  let reused = false;
  for (const item of lastTen) {
    if (await verifyPassword(item.hash, password)) {
      reused = true;
      break;
    }
  }

  if (reused) {
    return res.status(409).json({ message: 'Password reuse detected. Choose a new password.' });
  }

  const breach = await checkPwnedPassword(password);
  const hash = await hashPassword(password);
  await PasswordHistory.create({
    userId,
    hash,
    score,
    label,
    breached: breach.breached,
    reused,
  });

  const historyCount = await PasswordHistory.countDocuments({ userId });
  return res.status(201).json({
    message: 'Password hash stored securely.',
    reused,
    breached: breach.breached,
    historyCount,
  });
};

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const latest = await PasswordHistory.findOne({ userId }).sort({ createdAt: -1 });
  const historyCount = await PasswordHistory.countDocuments({ userId });

  return res.status(200).json({
    latestPasswordScore: latest?.score ?? 0,
    latestPasswordLabel: latest?.label ?? 'No data',
    breachStatus: latest?.breached ?? false,
    reuseStatus: latest?.reused ?? false,
    updatedAt: latest?.updatedAt ?? null,
    historyCount,
  });
};
