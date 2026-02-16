import express from 'express';
import AdminController from '../controllers/admin.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isSuperAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

// Authenticated
router.get('/summary', authenticateToken, AdminController.getSummary);
router.post('/change-password', authenticateToken, AdminController.changePassword);

// Super Admin only
router.get('/', authenticateToken, isSuperAdmin, AdminController.getAdmins);
router.post('/register', authenticateToken, isSuperAdmin, AdminController.register);
router.put('/:id', authenticateToken, isSuperAdmin, AdminController.updateAdmin);
router.patch('/:id/status', authenticateToken, isSuperAdmin, AdminController.toggleAdminStatus);

export default router;
