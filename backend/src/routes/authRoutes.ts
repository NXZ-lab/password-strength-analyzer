import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController';
import { handleValidation } from '../middleware/validate';

const router = Router();

const credentialsValidation = [
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  handleValidation,
];

router.post('/register', credentialsValidation, register);
router.post('/login', credentialsValidation, login);

export default router;
