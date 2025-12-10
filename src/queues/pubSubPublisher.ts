import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new IORedis(process.env.REDIS_URL!);

/**
 * Publishes a batch job to the Redis Pub/Sub channel
 */
export async function publishBatchJob(data: { batchId: string; resumes: string[] }): Promise<void> {
  await redis.publish('batch-processing', JSON.stringify(data));
  console.log('✅ Published batch job:', data.batchId);
}
