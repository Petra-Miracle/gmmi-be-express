import express from 'express';
import WartaController from '../controllers/warta.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', WartaController.getAll);
router.get('/all', WartaController.getAll);
router.post('/', authenticateToken, upload.single('thumbnail'), WartaController.create);
router.put('/:id', authenticateToken, upload.single('thumbnail'), WartaController.update);
router.patch('/:id/status', authenticateToken, WartaController.updateStatus);
router.delete('/:id', authenticateToken, WartaController.delete);

export default router;
