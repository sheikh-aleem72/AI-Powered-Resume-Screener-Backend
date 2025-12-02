import IORedis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/serverConfig';

const redis = new IORedis(env.REDIS_URL!);

// RQ queue name
const RQ_QUEUE = 'batch-processing';

// Publish a batch job into RQ format
export async function publishRQBatchJob(data: {
  batchId: string;
  jobDescriptionId: string;
  resumes: string[];
}) {
  // 1. Generate queueTaskId (RQ job ID)
  const queueTaskId = uuidv4();

  // 2. Prepare job payload (JSON string)
  // Python worker will parse this JSON manually
  const payload = JSON.stringify({
    batchId: data.batchId,
    jobDescriptionId: data.jobDescriptionId,
    resumes: data.resumes,
  });

  // 3. Store job in RQ format (Redis HASH)

  // Add description so RQ logging does not crash
  const description = `Process batch ${data.batchId}`;
  await redis.hmset(`rq:job:${queueTaskId}`, {
    data: payload, // Our JSON payload
    status: 'queued',
    description,
  });

  // 4. Push job onto RQ queue LIST
  await redis.lpush(`rq:queue:${RQ_QUEUE}`, queueTaskId);

  console.log(`📤 RQ job published: queueTaskId=${queueTaskId}, batchId=${data.batchId}`);

  return queueTaskId;
}
