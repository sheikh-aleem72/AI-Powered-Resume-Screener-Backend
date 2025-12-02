import { Request as ExRequest, Response } from 'express';
import { AppError } from '../utils/AppErrors';
import { analyzeResumeService } from '../services/analyzeResume.service';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const analyzeResumeController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeUrl, jobDescriptionId } = req.body;
    const result = await analyzeResumeService(resumeUrl, jobDescriptionId);
    return res.status(200).json({ success: true, parsedData: result });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in analyzeResumeController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
