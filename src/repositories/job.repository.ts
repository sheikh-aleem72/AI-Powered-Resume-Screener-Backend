import { JobModel, IJob } from '../schema/job.model';
import { Types } from 'mongoose';

export const createJob = async (payload: Partial<IJob>) => {
  const job = new JobModel(payload);
  return job.save();
};

export const findJobById = async (id: string, recruiterId: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return JobModel.findOne({ _id: id, createdBy: recruiterId })
    .select({
      title: 1,
      description: 1,
      required_skills: 1,
      experience_level: 1,
      min_experience_years: 1,
      totalResumes: 1,
      completedResumes: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .lean();
};

export const getJobsByRecruiter = async (id: string) => {
  return JobModel.find({ createdBy: id })
    .select({
      title: 1,
      createdAt: 1,
      totalResumes: 1,
      completedResumes: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 })
    .lean();
};

export const updateJobById = async (id: string, update: Partial<IJob>) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return JobModel.findByIdAndUpdate(id, update, { new: true }).lean();
};

export const deleteJobById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return JobModel.findByIdAndDelete(id);
};
