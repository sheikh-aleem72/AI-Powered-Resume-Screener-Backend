import { Request as ExRequest, Response } from 'express';
import * as service from '../services/job.service';
import { AppError } from '../utils/AppErrors';
import { success } from 'zod';
import { updateResumeAnalysis } from '../repositories/analysis.repository';

interface AuthRequest extends ExRequest {
  user?: {
    id: string;
  };
}

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;
    // attach createdBy if available
    if (req.user?.id) payload.createdBy = req.user.id;
    const job = await service.createJobService(payload);
    return res.status(201).json({ success: true, data: job });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in parseResumeController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const jobDescriptionId = req.params.id;
    const recruiterId = req.user?.id;
    if (!jobDescriptionId || !recruiterId) {
      return res.status(400).json({
        success: false,
        message: 'JobId or recruiterID is missing',
      });
    }
    const job = await service.getJobByIdService(jobDescriptionId, recruiterId);
    return res.status(200).json({ success: true, data: job });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in parseResumeController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobDescriptionId = req.params.id;
    if (!jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Job id is required',
      });
    }
    const job = await service.updateJobService(jobDescriptionId, req.body);
    return res.status(200).json({ success: true, data: job });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in parseResumeController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobDescriptionId = req.params.id;
    if (!jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Job id is required',
      });
    }
    await service.deleteJobService(jobDescriptionId);
    return res.status(204).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in parseResumeController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const getJobsByRecruiterController = async (req: AuthRequest, res: Response) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) {
      return res.status(400).json({
        success: false,
        message: 'recruiterId is required',
      });
    }

    const jobs = await service.getJobsByRecruiterService(recruiterId);
    return res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in getJobsByRecruiterController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const getJobResumesController = async (req: AuthRequest, res: Response) => {
  try {
    const recruiterId = req.user!.id;
    const { jobId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const status = req.query.status as string | undefined;
    const passFail = req.query.passFail as string | undefined;

    if (!jobId || !page || !limit) {
      throw new AppError('All fields are required!', 400);
    }

    const result = await service.getJobResumes({
      jobId,
      recruiterId,
      page,
      limit,
      status,
      passFail,
    });

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in getJobResumesController:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};

export const getJobUpdatesController = async (req: AuthRequest, res: Response) => {
  try {
    const recruiterId = req.user!.id;
    const { jobId } = req.params;

    if (!recruiterId || !jobId) {
      throw new AppError('All fields are required!', 400);
    }

    const since = req.query.since ? new Date(req.query.since as string) : null;

    const updates = await service.getJobUpdates({
      jobId,
      recruiterId,
      since,
    });

    res.status(200).json({
      success: true,
      data: updates,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }

    // ❌ Handle unexpected errors
    console.error('Error in getJobUpdates:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our side',
    });
  }
};
