import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createBatchController,
  getBatchByIdController,
  updateBatchController,
} from '../../controllers/batch.controller';

const router = express.Router();

// For postman testing
router.post('/create', createBatchController);

router.get('/:batchId', getBatchByIdController);

router.post('/update', updateBatchController);

export default router;
