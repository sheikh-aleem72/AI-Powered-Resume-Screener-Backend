import { publishRQBatchJob } from '../queues/rqPublisher';
import { createBatch, getBatchById } from '../repositories/batch.repository';
import { BatchModel, IBatch } from '../schema/batch.model';
import { AppError } from '../utils/AppErrors';
import { generateBatchId } from '../utils/generateBatchIds';
import { generateResumeId } from '../utils/generateResumesId';
import { env } from '../config/serverConfig';
import { ResumeProcessing } from '../schema/resumeProcessings.model.';

export type ResumeInput = {
  resumeObjectId: string;
  resumeUrl: string;
};

export const createBatchService = async (data: {
  jobDescriptionId: string;
  resumes: ResumeInput[];
  size: number;
}) => {
  const { jobDescriptionId, resumes, size } = data;

  console.log('Resumes: ', resumes);
  if (!jobDescriptionId || !resumes || resumes.length === 0) {
    throw new AppError('jobDescriptionId and resumes are required', 400);
  }
  // Validate count of files and size
  // ------------------------------------------------------
  // 1. VALIDATE MAX RESUMES
  // ------------------------------------------------------
  if (resumes.length > env.MAX_RESUMES_PER_BATCH) {
    throw new AppError(
      `A batch cannot contain more than ${env.MAX_RESUMES_PER_BATCH} resumes`,
      400,
    );
  }

  // ------------------------------------------------------
  // 2. VALIDATE TOTAL BYTES
  // ------------------------------------------------------
  // const totalBytes = resumes.reduce((sum, r) => sum + (size ?? 0), 0);

  if (size > env.MAX_TOTAL_BYTES_PER_BATCH) {
    throw new AppError(
      `Total batch size exceeds ${env.MAX_TOTAL_BYTES_PER_BATCH / (1024 * 1024)} MB`,
      400,
    );
  }

  // Generate BatchId
  const batchId = await generateBatchId();
  const resumesArray = resumes;

  // 3. Create ResumeProcessing records
  const resumeProcessing = await ResumeProcessing.insertMany(
    await Promise.all(
      resumesArray.map(async (resume) => ({
        externalResumeId: await generateResumeId(),
        resumeObjectId: resume.resumeObjectId,
        jobDescriptionId: jobDescriptionId,
        resumeUrl: resume.resumeUrl,
        batchId,
        status: 'queued',
      })),
    ),
  );

  // 4. Build batch.resumes references
  const batchResumes = resumeProcessing.map((rp, index) => ({
    resumeObjectId: rp.resumeObjectId,
    resumeUrl: rp.resumeUrl,
    resumeProcessingId: rp._id.toString(),
    externalResumeId: rp.externalResumeId,
  }));

  // 5. Create batch
  const batch = await createBatch({
    batchId,
    jobDescriptionId: jobDescriptionId,
    resumes: batchResumes,
    totalResumes: batchResumes.length,
    size: size,
  });

  // 6. Publish jobs (IMPORTANT CHANGE)
  await publishRQBatchJob({
    batchId,
    jobDescriptionId: jobDescriptionId,
    resumes: resumeProcessing.map((rp, i) => ({
      resumeProcessingId: rp._id.toString(), //  resumeProcessingId
      resumeUrl: rp.resumeUrl,
      externalResumeId: rp.externalResumeId,
    })),
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
  const status = data.status === 'completed' ? 'completed' : 'failed';

  const update = await BatchModel.updateOne(
    {
      batchId,
      'resumes.resumeId': resumeId,
    },
    {
      $set: { 'resumes.$.status': status },
      $inc: {
        processedResumes: 1,
        ...(status === 'completed' ? { completedResumes: 1 } : { failedResumes: 1 }),
      },
    },
  );

  if (update.matchedCount === 0) {
    throw new AppError('Resume not found in batch!', 404);
  }

  // After updating counters, check if batch should be marked completed
  const batch = await BatchModel.findOne({ batchId }).select(
    'processedResumes totalResumes failedResumes',
  );

  if (!batch) {
    throw new AppError('Batch Not found!', 404);
  }

  if (batch.processedResumes === batch.totalResumes) {
    const finalStatus = batch.failedResumes > 0 ? 'failed' : 'completed';

    await BatchModel.updateOne({ batchId }, { $set: { status: finalStatus } });
  }

  console.log(`✅ Atomic update successful for resume ${resumeId}`);
  return true;
};
