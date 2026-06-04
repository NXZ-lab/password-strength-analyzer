import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signToken = (payload: { userId: string; email: string }) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyToken = (token: string) =>
  jwt.verify(token, env.jwtSecret) as { userId: string; email: string };
