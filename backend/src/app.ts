import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import passwordRoutes from './routes/passwordRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => res.status(200).json({ message: 'API is healthy.' }));
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use(errorHandler);

export default app;
