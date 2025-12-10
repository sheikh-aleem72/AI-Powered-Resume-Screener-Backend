import { addBatchJob } from '../queues/batchQueue';

interface ResumeBatchJob {
  batchId: string;
  resumes: string[];
  createdAt: Date;
}

export async function enqueueBatchProcessing(batchId: string, resumes: string[]): Promise<void> {
  const job: ResumeBatchJob = {
    batchId,
    resumes,
    createdAt: new Date(),
  };

  await addBatchJob(job);
}
