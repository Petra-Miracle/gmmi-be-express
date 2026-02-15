import express from 'express';
import PewartaanController from '../controllers/pewartaan.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isSuperAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

// Public / Auth Member (can be read by all authenticated users if needed, or just admin)
router.get('/', authenticateToken, PewartaanController.getAll);
router.get('/:id', authenticateToken, PewartaanController.getById);

// Export (Direct Link)
router.get('/:id/export/excel', authenticateToken, PewartaanController.exportExcel);
router.get('/:id/export/word', authenticateToken, PewartaanController.exportWord);

// Super Admin Only
router.post('/', authenticateToken, isSuperAdmin, PewartaanController.create);
router.put('/:id', authenticateToken, isSuperAdmin, PewartaanController.update);
router.delete('/:id', authenticateToken, isSuperAdmin, PewartaanController.delete);
router.patch('/:id/status', authenticateToken, isSuperAdmin, PewartaanController.updateStatus);

export default router;
