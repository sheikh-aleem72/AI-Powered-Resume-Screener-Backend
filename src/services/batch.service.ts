import { publishBatchJob } from '../queues/pubSubPublisher';
import { createBatch, updateBatchStatus } from '../repositories/batch.repository';
import { IBatch } from '../schema/batch.model';
import { AppError } from '../utils/AppErrors';

export const createBatchService = async (data: Partial<IBatch>) => {
  if (!data.batchId || !data.jobDescriptionId || !data.resumes) {
    throw new AppError(`BatchId, jobId, and resumes are required`, 400);
  }

  const batch = await createBatch(data);

  await publishBatchJob(batch);

  return batch;
};

export const updateBatchService = async (batchId: string, data: Partial<IBatch>) => {
  console.log('Batch id & status', batchId, data.status);

  if (!batchId || !data.status) {
    throw new AppError('batchId and status are required!', 400);
  }

  console.log('Checkpoint');
  const update = {
    status: data.status,
    error: data.status === 'failed' ? data.error : undefined,
  };

  const updatedBatch = await updateBatchStatus(batchId, data);

  if (!updatedBatch) {
    throw new AppError('Batch not found', 404);
  }

  console.log(`✅ Batch ${batchId} marked as ${data.status}`);

  return updatedBatch;
};
