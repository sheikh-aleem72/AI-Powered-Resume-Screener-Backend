import { publishBatchJob } from '../queues/pubSubPublisher';
import { publishRQBatchJob } from '../queues/rqPublisher';
import { createBatch, getBatchById, updateBatchStatus } from '../repositories/batch.repository';
import { IBatch } from '../schema/batch.model';
import { AppError } from '../utils/AppErrors';
import { generateBatchId } from '../utils/generateBatchIds';

export const createBatchService = async (data: Partial<IBatch>) => {
  if (!data.jobDescriptionId || !data.resumes) {
    throw new AppError(`jobDescriptionId and resumes are required`, 400);
  }

  // Generate BatchId
  const batchId = await generateBatchId();
  data.batchId = batchId;
  data.totalResumes = data.resumes.length;

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

export const updateBatchService = async (batchId: string, data: Partial<IBatch>) => {
  // console.log('Batch id & status', batchId, data.status);

  if (!batchId || !data.status) {
    throw new AppError('batchId and status are required!', 400);
  }

  const batch = await getBatchByIdService(batchId);

  // console.log('Checkpoint');
  const update = {
    status: data.status,
    error: data.status === 'failed' ? data.error : undefined,
  };

  const isFailed = data.status === 'failed';

  const updatedBatch = await updateBatchStatus(batchId, {
    status: isFailed ? 'failed' : 'completed',
    processedResumes: batch.totalResumes,
    completedResumes: isFailed ? 0 : batch.totalResumes,
    failedResumes: isFailed ? batch.totalResumes : 0,
  });

  if (!updatedBatch) {
    throw new AppError('Batch not found', 404);
  }

  console.log(`✅ Batch ${batchId} marked as ${data.status}`);

  return updatedBatch;
};
