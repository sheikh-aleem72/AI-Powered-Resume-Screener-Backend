import { Request as ExRequest, Response } from 'express';
import { AppError } from '../utils/AppErrors';
import {
  createResumeProcessingService,
  getResumeProcessingsService,
  resumeProcessingCallbackService,
  updateResumeProcessingsService,
} from '../services/resumeProcessing.service';
import { success } from 'zod';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const createResumeProcessingController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeObjectId, jobDescriptionId, batchId, status } = req.body;

    const response = await createResumeProcessingService(
      resumeObjectId,
      jobDescriptionId,
      status,
      batchId,
    );

    return res.status(201).json({
      success: true,
      message: 'ResumeProcessings is created successfully!',
      data: response,
    });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in createResumeProcessings:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const getResumeProcessingController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeProcessingId } = req.params;

    const response = await getResumeProcessingsService(resumeProcessingId!);

    return res.status(200).json({
      success: true,
      message: 'ResumeProcessings is fetched successfully!',
      data: response,
    });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in getResumeProcessings:');
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const updateResumeProcessingController = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeProcessingId, status } = req.body;

    const response = await updateResumeProcessingsService(resumeProcessingId, status);

    return res.status(200).json({
      success: true,
      message: 'ResumeProcessings is updated successfully!',
      data: response,
    });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in updateResumeProcessings:');
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const resumeProcessingCallbackController = async (req: AuthRequest, res: Response) => {
  try {
    const response = await resumeProcessingCallbackService(req.body);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    // ✅ Handle operational (AppError) errors gracefully
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in resumeProcessingCallbackController:');
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
