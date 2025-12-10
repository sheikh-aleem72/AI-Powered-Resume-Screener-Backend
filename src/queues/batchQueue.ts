import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

interface ResumeBatchJob {
  batchId: string;
  resumes: string[];
  createdAt: Date;
}

const connection = new IORedis(process.env.REDIS_URL as string);

export const batchQueue = new Queue<ResumeBatchJob>('batch-processing', {
  connection,
});

/**
 * Adds a batch job to the Redis queue
 */
export async function addBatchJob(data: ResumeBatchJob): Promise<void> {
  await batchQueue.add('processBatch', data, {
    attempts: 3,
    removeOnComplete: true,
    backoff: { type: 'exponential', delay: 5000 },
  });
  console.log('✅ Job added to queue:', data.batchId);
}
