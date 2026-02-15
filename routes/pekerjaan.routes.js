import express from 'express';
import PekerjaanController from '../controllers/pekerjaan.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (bisa diakses siapa saja yang sudah login)
router.get('/', authenticateToken, PekerjaanController.getAll);
router.get('/:id', authenticateToken, PekerjaanController.getById);

// Admin only routes
router.post('/', authenticateToken, PekerjaanController.create);
router.put('/:id', authenticateToken, PekerjaanController.update);
router.delete('/:id', authenticateToken, PekerjaanController.delete);

export default router;
