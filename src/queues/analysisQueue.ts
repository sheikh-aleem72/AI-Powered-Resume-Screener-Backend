import IORedis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/serverConfig';

const redis = new IORedis(env.REDIS_URL!);
const RQ_QUEUE = 'analysis-processing';

export async function publishAnalysisJob(data: { resumeProcessingId: string }) {
  const queueTaskId = uuidv4();

  const payload = JSON.stringify({
    resumeProcessingId: data.resumeProcessingId,
    attempt: 1,
    triggeredBy: 'recruiter',
  });

  const description = `Analyze resumeProcessing ${data.resumeProcessingId}`;

  await redis.hmset(`rq:job:${queueTaskId}`, {
    data: payload,
    status: 'queued',
    description,
    attempts: '0',
  });

  await redis.lpush(`rq:queue:${RQ_QUEUE}`, queueTaskId);

  console.log(`📤 Analysis job queued: ${data.resumeProcessingId}`);

  return { taskId: queueTaskId };
}
