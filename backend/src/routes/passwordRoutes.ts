import { Router } from 'express';
import { body } from 'express-validator';
import { analyzeAndStore, breachCheck, getDashboard } from '../controllers/passwordController';
import { requireAuth } from '../middleware/authMiddleware';
import { handleValidation } from '../middleware/validate';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', getDashboard);
router.post('/breach-check', [body('password').isString().notEmpty(), handleValidation], breachCheck);
router.post(
  '/analyze-and-store',
  [
    body('password').isString().isLength({ min: 8 }),
    body('score').isInt({ min: 0, max: 4 }),
    body('label').isIn(['Weak', 'Medium', 'Strong']),
    handleValidation,
  ],
  analyzeAndStore,
);

export default router;
