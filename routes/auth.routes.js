import express from 'express';
import { login, me } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateToken, me);

router.get('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

export default router;
