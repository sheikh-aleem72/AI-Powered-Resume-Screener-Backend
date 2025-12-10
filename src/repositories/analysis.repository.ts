import { ResumeAnalysisModel, IResumeAnalysis } from '../schema/resumeAnalysis.model';

export const createResumeAnalysis = async (data: Partial<IResumeAnalysis>) => {
  return await ResumeAnalysisModel.create(data);
};

export const findAnalysisByResumeAndJob = async (resumeId: string, jobDescriptionId: string) => {
  return await ResumeAnalysisModel.findOne({ resumeId, jobDescriptionId });
};

export const findAnalysisById = async (id: string) => {
  return await ResumeAnalysisModel.findById(id);
};

export const updateResumeAnalysis = async (id: string, updateData: Partial<IResumeAnalysis>) => {
  return await ResumeAnalysisModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const getAllAnalyses = async () => {
  return await ResumeAnalysisModel.find().populate('resumeId jobDescriptionId');
};

export const deleteAnalysis = async (id: string) => {
  return await ResumeAnalysisModel.findByIdAndDelete(id);
};
