import express from 'express';
import userRouter from './user.routes';
import cloudinaryRouter from './cloudinary.routes';
import resumeRouter from './resume.routes';
import parsedResumeRouter from './parsedResume.routes';
import jobRouter from './job.routes';
import resumeAnalysisRouter from './analysis.routes';
import analyzeResumeRouter from './analyzeResume.routes';
import batchRouter from './batch.routes';
import resumeProcessingsRouter from './resumeProcessings.routes';

const router = express.Router();

// Authentication and user routes
router.use('/user', userRouter);

// Cloudinary route
router.use('/cloudinary', cloudinaryRouter);

// Resume route
router.use('/resume', resumeRouter);

// Resume parser route
router.use('/parse-resume', parsedResumeRouter);

// Job route
router.use('/job', jobRouter);

// Resume Analysis route
router.use('/resume-analysis', resumeAnalysisRouter);

// Analyze resume with just resume url
router.use('/analyze-resume', analyzeResumeRouter);

// Handler routes related to batch
router.use('/batch', batchRouter);

// Handle routes related to resumeProcessings
router.use('/processing', resumeProcessingsRouter);

export default router;
