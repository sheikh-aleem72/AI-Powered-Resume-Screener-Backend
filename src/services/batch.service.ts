import { publishBatchJob } from '../queues/pubSubPublisher';
import { publishRQBatchJob } from '../queues/rqPublisher';
import { createBatch, getBatchById, updateBatchStatus } from '../repositories/batch.repository';
import { IBatch } from '../schema/batch.model';
import { AppError } from '../utils/AppErrors';
import { generateBatchId } from '../utils/generateBatchIds';
import { generateResumeId } from '../utils/generateResumesId';
import { env } from '../config/serverConfig';

export const createBatchService = async (data: Partial<IBatch>) => {
  if (!data.jobDescriptionId || !data.resumes) {
    throw new AppError(`jobDescriptionId and resumes are required`, 400);
  }

  // Validate count of files and size
  // ------------------------------------------------------
  // 1. VALIDATE MAX RESUMES
  // ------------------------------------------------------
  if (data.resumes.length > env.MAX_RESUMES_PER_BATCH) {
    throw new AppError(
      `A batch cannot contain more than ${env.MAX_RESUMES_PER_BATCH} resumes`,
      400,
    );
  }

  // ------------------------------------------------------
  // 2. VALIDATE TOTAL BYTES
  // ------------------------------------------------------
  const totalBytes = data.resumes.reduce((sum, r) => sum + (data.size ?? 0), 0);

  if (totalBytes > env.MAX_TOTAL_BYTES_PER_BATCH) {
    throw new AppError(
      `Total batch size exceeds ${env.MAX_TOTAL_BYTES_PER_BATCH / (1024 * 1024)} MB`,
      400,
    );
  }

  // Generate BatchId
  const batchId = await generateBatchId();
  const resumes = [];

  for (const resume of data.resumes) {
    const resumeId = await generateResumeId();
    resumes.push({ resumeId, resumeUrl: resume.resumeUrl, status: 'queued' });
  }

  data.batchId = batchId;
  data.totalResumes = data.resumes.length;
  data.resumes = resumes;

  const batch = await createBatch(data);

  await publishRQBatchJob({
    batchId: batch.batchId,
    jobDescriptionId: batch.jobDescriptionId,
    resumes: batch.resumes,
  });

  console.log('Batch published!');

  return batch;
};

export const getBatchByIdService = async (batchId: string) => {
  if (!batchId) {
    throw new AppError('BatchId is required!', 400);
  }

  const batch = await getBatchById(batchId);
  if (!batch) {
    throw new AppError('Batch not found!', 404);
  }

  return batch;
};

export const updateBatchService = async (
  batchId: string,
  resumeId: string,
  data: Partial<IBatch>,
) => {
  // console.log('Batch id & status', batchId, data.status);

  if (!batchId || !resumeId) {
    throw new AppError('batchId and resumeId are required!', 400);
  }

  const batch = await getBatchByIdService(batchId);

  // console.log('Checkpoint');
  // Update resume entry inside the batch document
  const resumeEntry = batch.resumes.find((r) => r.resumeId === resumeId);

  if (!resumeEntry) {
    throw new AppError('Resume not found in batch!', 404);
  }

  resumeEntry.status = data.status === 'completed' ? 'completed' : 'failed';

  // Increment batch counters
  batch.processedResumes += 1;

  if (data.status === 'completed') {
    batch.completedResumes += 1;
  } else {
    batch.failedResumes += 1;
  }

  // If all resumes finished → mark batch completed or failed
  if (batch.processedResumes === batch.totalResumes) {
    batch.status = batch.failedResumes > 0 ? 'failed' : 'completed';
  } else {
    batch.status = 'processing';
  }

  // const updatedBatch = await updateBatchStatus(batchId, {
  //   status: isFailed ? 'failed' : 'completed',
  //   processedResumes: batch.totalResumes,
  //   completedResumes: isFailed ? 0 : batch.totalResumes,
  //   failedResumes: isFailed ? batch.totalResumes : 0,
  // });

  await batch.save();

  // if (!updatedBatch) {
  //   throw new AppError('Batch not found', 404);
  // }

  console.log(`✅ Batch ${batchId} marked as ${data.status}`);

  return batch;
};
