import { Router } from 'express';
import * as controller from '../../controllers/job.controller';
import { validateJobCreation } from '../../validators/job.validators';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// Create job
router.post('/', authMiddleware, validateJobCreation, controller.createJob);

// Get job by id
router.get('/:id', authMiddleware, controller.getJobById);

// Get jobs by recruiter
router.get('/', authMiddleware, controller.getJobsByRecruiterController);

// Update job
router.patch('/:id', authMiddleware, controller.updateJob);

// Delete job by id
router.delete('/:id', authMiddleware, controller.deleteJob);

export default router;
