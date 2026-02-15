import express from 'express';
import KeuanganController from '../controllers/keuangan.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isSuperAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

// Summary route (public)
router.get('/summary', KeuanganController.getSummary);

// Excel Export (Super Admin Only)
router.get('/export', authenticateToken, isSuperAdmin, KeuanganController.exportExcel);

// CRUD
router.get('/', KeuanganController.getAll);
router.post('/', authenticateToken, isSuperAdmin, KeuanganController.create);
router.put('/:id', authenticateToken, isSuperAdmin, KeuanganController.update);
router.delete('/:id', authenticateToken, isSuperAdmin, KeuanganController.delete);

export default router;