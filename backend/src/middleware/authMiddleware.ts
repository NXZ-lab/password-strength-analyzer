import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing.' });
  }

  try {
    req.user = verifyToken(authHeader.replace('Bearer ', ''));
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
