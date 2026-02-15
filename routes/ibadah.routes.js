import express from 'express';
import JadwalController from '../controllers/ibadah.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isSuperAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', JadwalController.getAll);
router.post('/', authenticateToken, isSuperAdmin, JadwalController.create);
router.put('/:id', authenticateToken, isSuperAdmin, JadwalController.update);
router.delete('/:id', authenticateToken, isSuperAdmin, JadwalController.delete);

export default router;
