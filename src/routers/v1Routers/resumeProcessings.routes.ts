import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  analyzeResumeController,
  createResumeProcessingController,
  getAnalysisStatusController,
  getResumeProcessingByIdController,
  resumeProcessingCallbackController,
  updateResumeProcessingController,
} from '../../controllers/resumeProcessings.controller';

const router = express.Router();

router.post('/create', authMiddleware, createResumeProcessingController);

router.get('/:resumeProcessingId', authMiddleware, getResumeProcessingByIdController);

router.post('/update', authMiddleware, updateResumeProcessingController);

router.post('/callback', resumeProcessingCallbackController);

router.post('/:resumeProcessingId/analyze', analyzeResumeController);

router.get('/:resumeProcessingId/analysis', getAnalysisStatusController);

export default router;
