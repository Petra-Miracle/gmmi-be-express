import express from 'express';
import ArsipController from '../controllers/arsip.controller.js';

const router = express.Router();

router.get('/', ArsipController.getArsip);

export default router;
