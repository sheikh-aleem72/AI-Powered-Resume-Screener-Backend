import { saveResumeMetaData } from '../repositories/resume.repository';
import { IResumeInput, ResumeModel } from '../schema/resume.model';
import { AppError } from '../utils/AppErrors';

interface ResumeInputType {
  filename: string;
  url: string;
  folder: string;
  size: number;
  format: string;
  uploadedBy: string;
}

export const saveResumeService = async (resumes: ResumeInputType[]) => {
  const savedResumes = await Promise.all(resumes.map((resume) => saveResumeMetaData(resume)));
  return savedResumes;
};

export const getSavedResumeIdService = async (url: string) => {
  const response = await ResumeModel.findOne({ url });
  if (!response) {
    throw new AppError('No saved resume found!', 404);
  }
  return response;
};
