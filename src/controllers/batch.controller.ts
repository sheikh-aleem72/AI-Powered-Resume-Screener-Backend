import { Request as ExRequest, Response } from 'express';
import { AppError } from '../utils/AppErrors';
import { createBatchService, updateBatchService } from '../services/batch.service';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const createBatchController = async (req: AuthRequest, res: Response) => {
  try {
    const { jobDescriptionId, resumes } = req.body;

    const batch = await createBatchService({ jobDescriptionId, resumes });

    return res.status(200).json({ success: true, data: batch });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in createBatchController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const updateBatchController = async (req: AuthRequest, res: Response) => {
  try {
    const { batchId, status, error } = req.body;
    // console.log('Batch id & status', batchId, status);
    const updatedBatch = await updateBatchService(batchId, { status, error });

    return res.status(200).json({
      success: true,
      data: updatedBatch,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in updateBatchController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
