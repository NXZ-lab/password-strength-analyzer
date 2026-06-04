import { Request, Response } from 'express';
import { User } from '../models/User';
import { hashPassword, verifyPassword } from '../utils/hash';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered.' });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });
  const token = signToken({ userId: user.id, email: user.email });

  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const validPassword = await verifyPassword(user.passwordHash, password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = signToken({ userId: user.id, email: user.email });
  return res.status(200).json({
    token,
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
  });
};
