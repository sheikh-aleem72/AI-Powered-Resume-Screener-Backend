import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  analyzeResumeController,
  createResumeProcessingController,
  getAnalysisStatusController,
  getResumeProcessingController,
  resumeProcessingCallbackController,
  updateResumeProcessingController,
} from '../../controllers/resumeProcessings.controller';

const router = express.Router();

router.post('/create', authMiddleware, createResumeProcessingController);

router.get('/:batchId', getResumeProcessingController);

router.post('/update', authMiddleware, updateResumeProcessingController);

router.post('/callback', resumeProcessingCallbackController);

router.post('/:resumeProcessingId/analyze', analyzeResumeController);

router.get('/:resumeProcessingId/analysis', getAnalysisStatusController);

export default router;
