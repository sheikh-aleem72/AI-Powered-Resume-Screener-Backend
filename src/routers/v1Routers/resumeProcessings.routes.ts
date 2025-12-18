import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createResumeProcessingController,
  getResumeProcessingController,
  resumeProcessingCallbackController,
  updateResumeProcessingController,
} from '../../controllers/resumeProcessings.controller';

const router = express.Router();

router.post('/create', authMiddleware, createResumeProcessingController);

router.get('/:resumeProcessingId', authMiddleware, getResumeProcessingController);

router.post('/update', authMiddleware, updateResumeProcessingController);

router.post('/callback', resumeProcessingCallbackController);

export default router;
