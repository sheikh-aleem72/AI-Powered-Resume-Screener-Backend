import IORedis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/serverConfig';

export type ResumeInput =
  | string
  | {
      resumeProcessingId: string;
      resumeUrl?: string;
      externalResumeId: string;
    };

export type PublishedTask = {
  taskId: string; // internal RQ job id (uuid)
  resumeId: string;
  resumeUrl?: string | null;
};

const redis = new IORedis(env.REDIS_URL!);

// RQ queue name
const RQ_QUEUE = 'batch-processing';

// Publish a batch job into RQ format
export async function publishRQBatchJob(data: {
  batchId: string;
  jobDescriptionId: string;
  resumes: ResumeInput[];
}): Promise<PublishedTask[]> {
  const published: PublishedTask[] = [];

  for (const r of data.resumes) {
    const resumeProcessingId = typeof r === 'string' ? r : r.resumeProcessingId;
    const resumeUrl = typeof r === 'string' ? null : (r.resumeUrl ?? null);
    const externalResumeId = typeof r === 'string' ? null : r.externalResumeId;
    // 1. Generate queueTaskId (RQ job ID)
    const queueTaskId = uuidv4();

    // 2. Prepare job payload (JSON string)
    // Python worker will parse this JSON manually
    const payload = JSON.stringify({
      batchId: data.batchId,
      jobDescriptionId: data.jobDescriptionId,
      resumeProcessingId,
      resumeUrl,
      externalResumeId,
    });

    // 3. Store job in RQ format (Redis HASH)

    // Add description so RQ logging does not crash
    const description = `Process resume ${externalResumeId} for batch ${data.batchId}`;
    await redis.hmset(`rq:job:${queueTaskId}`, {
      data: payload, // Our JSON payload
      status: 'queued',
      description,
      attempts: '0',
    });

    // 4. Push job onto RQ queue LIST
    await redis.lpush(`rq:queue:${RQ_QUEUE}`, queueTaskId);

    console.log(`📤 Job published for resume: ${externalResumeId}`);
  }
  return published;
}
