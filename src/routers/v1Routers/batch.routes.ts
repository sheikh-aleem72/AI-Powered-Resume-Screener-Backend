import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createBatchController,
  getBatchByIdController,
  updateBatchController,
} from '../../controllers/batch.controller';

const router = express.Router();

// For postman testing
router.post('/create', authMiddleware, createBatchController);

router.get('/', getBatchByIdController);

router.post('/update', updateBatchController);

export default router;
