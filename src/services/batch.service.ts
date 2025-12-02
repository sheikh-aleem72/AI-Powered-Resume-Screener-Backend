import { publishBatchJob } from '../queues/pubSubPublisher';
import { publishRQBatchJob } from '../queues/rqPublisher';
import { createBatch, updateBatchStatus } from '../repositories/batch.repository';
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

  const batch = await createBatch(data);

  await publishRQBatchJob({
    batchId: batch.batchId,
    jobDescriptionId: batch.jobDescriptionId,
    resumes: batch.resumes,
  });

  console.log('Batch published!');

  return batch;
};

export const updateBatchService = async (batchId: string, data: Partial<IBatch>) => {
  // console.log('Batch id & status', batchId, data.status);

  if (!batchId || !data.status) {
    throw new AppError('batchId and status are required!', 400);
  }

  // console.log('Checkpoint');
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
