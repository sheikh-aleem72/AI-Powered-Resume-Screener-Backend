import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { getPresignedUrls } from '../../controllers/cloudinary.controller';
import { uploadMultipleMiddleware, uploadMultipleToCloudinary } from '../../scripts/testCloudinary';

const router = express.Router();

router.get('/presigned-urls', authMiddleware, getPresignedUrls);

// route to directly upload file to cloudinary (For testing)
router.get('/upload', uploadMultipleMiddleware, uploadMultipleToCloudinary);

export default router;
