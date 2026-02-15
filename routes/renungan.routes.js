
import express from 'express';
import RenunganController from '../controllers/renungan.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isSuperAdmin } from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', RenunganController.getAll);
router.get('/:id', RenunganController.getById);

// Admin routes (Protected + SuperAdmin)
router.post('/', authenticateToken, isSuperAdmin, upload.single('gambar'), (req, res) => RenunganController.create(req, res));
router.put('/:id', authenticateToken, isSuperAdmin, upload.single('gambar'), (req, res) => RenunganController.update(req, res));
router.delete('/:id', authenticateToken, isSuperAdmin, RenunganController.delete);

export default router;
