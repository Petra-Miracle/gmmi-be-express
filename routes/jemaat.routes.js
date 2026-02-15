import express from 'express';
import JemaatController from '../controllers/jemaat.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { isSuperAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, JemaatController.getAll);
router.post('/', authenticateToken, isSuperAdmin, JemaatController.create);
router.put('/:id', authenticateToken, isSuperAdmin, JemaatController.update);
router.delete('/:id', authenticateToken, isSuperAdmin, JemaatController.delete);
router.get('/sectors', authenticateToken, JemaatController.getSectors);
router.post('/sectors', authenticateToken, isSuperAdmin, JemaatController.createSector);
router.put('/sectors/:id', authenticateToken, isSuperAdmin, JemaatController.updateSector);
router.delete('/sectors/:id', authenticateToken, isSuperAdmin, JemaatController.deleteSector);

export default router;
