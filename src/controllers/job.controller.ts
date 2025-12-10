import { Request as ExRequest, Response } from 'express';
import * as service from '../services/job.service';
import { AppError } from '../utils/AppErrors';

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

export const getJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobDescriptionId = req.params.id;
    if (!jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Job id is required',
      });
    }
    const job = await service.getJobService(jobDescriptionId);
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

export const listJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { text, skill, experience, limit = 20, skip = 0 } = req.query;

    const jobs = await service.listJobsService(
      {
        text: text as string,
        skill: skill as string,
        experience: experience ? Number(experience) : 0,
      },
      { limit: Number(limit), skip: Number(skip) },
    );
    return res.status(200).json({ success: true, data: jobs });
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
