import express from 'express';
import PengumumanController from '../controllers/pengumuman.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', PengumumanController.getAll);
router.get('/all', PengumumanController.getAll);
router.post('/', authenticateToken, PengumumanController.create);
router.put('/:id', authenticateToken, PengumumanController.update);
router.delete('/:id', authenticateToken, PengumumanController.delete);

export default router;
