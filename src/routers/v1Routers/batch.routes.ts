import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { createBatchController, updateBatchController } from '../../controllers/batch.controller';

const router = express.Router();

// For postman testing
router.post('/create', authMiddleware, createBatchController);

router.post('/update', updateBatchController);

export default router;
