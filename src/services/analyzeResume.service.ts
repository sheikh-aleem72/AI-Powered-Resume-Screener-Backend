import { analyze_resume } from '../utils/analyzerAPI';
import { AppError } from '../utils/AppErrors';
import { createAnalysisService, findAnalysisByResumeIdAndJobIdService } from './analysis.service';
import { getJobService } from './job.service';
import { parseAndSaveResumeService } from './parsedResume.service';

export const analyzeResumeService = async (resumeUrl: string, jobDescriptionId: string) => {
  // 1. Parse resume
  const parsedResume = await parseAndSaveResumeService(resumeUrl);

  // 2. Analyze Resume
  // Get job description from jobId
  const jobDescription = await getJobService(jobDescriptionId);
  if (jobDescription == null) {
    throw new AppError('Job Description not found!', 404);
  }

  // Check if analysis is already exists
  const analysis = await findAnalysisByResumeIdAndJobIdService(
    parsedResume.resumeId.toString(),
    jobDescriptionId,
  );
  if (analysis != null) {
    return analysis;
  }

  // Call analyzer API
  const resumeAnalysis = await analyze_resume(parsedResume, jobDescription);
  if (!resumeAnalysis) {
    throw new AppError('Some internal server error!', 500);
  }

  // 3. Save analysis
  resumeAnalysis.resumeId = parsedResume.resumeId.toString();
  resumeAnalysis.jobDescriptionId = jobDescriptionId;
  const newResumeAnalysis = await createAnalysisService(resumeAnalysis);

  // 4. Send response back.
  return newResumeAnalysis;
};
