import { IJob } from '../schema/job.model';
import {
  createJob,
  deleteJobById,
  findJobById,
  getJobsByRecruiter,
  updateJobById,
} from '../repositories/job.repository';
import { AppError } from '../utils/AppErrors';

export const createJobService = async (payload: Partial<IJob>) => {
  // Basic business validation can go here (e.g., ensure required_skills not empty)
  if (!payload.title) throw new Error('Job title required');

  if (!payload.required_skills || payload.required_skills.length === 0) {
    throw new AppError('required_skills must include at least one skill', 400);
  }

  if (!payload.createdBy) {
    throw new AppError("Creator's id is required!", 400);
  }

  return createJob(payload);
};

export const getJobByIdService = async (id: string, recruiterId: string) => {
  const job = await findJobById(id, recruiterId);
  if (!job) throw new AppError('Job not found', 404);
  return job;
};

export const updateJobService = async (id: string, update: Partial<IJob>) => {
  const job = await updateJobById(id, update);
  if (!job) throw new Error('Job not found or update failed');
  return job;
};

export const deleteJobService = async (id: string) => {
  const deleted = await deleteJobById(id);
  if (!deleted) throw new AppError('Job not found or delete failed', 404);
  return deleted;
};

export const getJobsByRecruiterService = async (recruiterId: string) => {
  return getJobsByRecruiter(recruiterId);
};
