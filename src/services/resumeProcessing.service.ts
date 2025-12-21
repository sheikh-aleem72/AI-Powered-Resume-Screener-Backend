import { BatchModel } from '../schema/batch.model';
import { ResumeProcessing } from '../schema/resumeProcessings.model.';
import { AppError } from '../utils/AppErrors';

interface ResumeProcessingCallbackPayload {
  resumeProcessingId: string;
  batchId: string;
  status: 'completed' | 'failed' | 'processing';
  externalResumeId: string;
}

export const createResumeProcessingService = async (
  resumeObjectId: string,
  jobDescriptionId: string,
  status: string,
  batchId: string,
) => {
  if (!resumeObjectId || !jobDescriptionId || !batchId) {
    throw new AppError('All fields are required!', 400);
  }

  const newResumeProcessing = await ResumeProcessing.create({
    resumeObjectId,
    jobDescriptionId,
    status,
    batchId,
  });

  if (newResumeProcessing === null) {
    throw new AppError('Failed to create resumeProcessing document', 500);
  }

  return newResumeProcessing;
};

export const getResumeProcessingsService = async (batchId: string) => {
  if (batchId === null) {
    throw new AppError('batchId is required', 400);
  }

  const resumeProcessings = await ResumeProcessing.find({ batchId });

  if (resumeProcessings === null) {
    throw new AppError('resumeProcessings not found', 404);
  }

  return resumeProcessings;
};

export const updateResumeProcessingsService = async (
  resumeProcessingId: string,
  status: string,
) => {
  if (resumeProcessingId === null) {
    throw new AppError('resumeProcessingId is required', 400);
  }

  const response = await ResumeProcessing.findOneAndUpdate(
    {
      _id: resumeProcessingId,
    },
    {
      $set: { status: status },
    },
    { new: true },
  );

  return response;
};

export const resumeProcessingCallbackService = async (payload: ResumeProcessingCallbackPayload) => {
  const { resumeProcessingId, batchId, status } = payload;

  if (!resumeProcessingId || !batchId || !status) {
    throw new AppError('Invalid callback payload', 400);
  }

  // 1. Read ResumeProcessing for idempotency guard
  const processing = await ResumeProcessing.findById(resumeProcessingId);

  if (!processing) {
    throw new AppError('ResumeProcessing not found', 404);
  }

  // If already accounted → idempotent return
  if (processing.batchAccounted === true) {
    return {
      resumeProcessingId,
      batchId,
      status: processing.status,
      duplicate: true,
    };
  }

  // 2. Prepare atomic batch update
  const update: Record<string, any> = {
    $inc: { processedResumes: 1 },
  };

  if (status === 'completed') {
    update.$inc.completedResumes = 1;
  } else if (status === 'failed') {
    update.$inc.failedResumes = 1;
  } else {
    throw new AppError('Invalid status value', 400);
  }

  // 3. Update Batch atomically
  const batch = await BatchModel.findOneAndUpdate({ batchId }, update, { new: true });

  if (!batch) {
    throw new AppError('Batch not found', 404);
  }

  // 4. Finalize batch if all done
  if (batch.completedResumes + batch.failedResumes >= batch.totalResumes) {
    batch.status = 'completed';
    await batch.save();
  }

  // 5. Mark ResumeProcessing as accounted
  await ResumeProcessing.updateOne({ _id: resumeProcessingId }, { $set: { batchAccounted: true } });

  return {
    resumeProcessingId,
    batchId,
    status,
    batchStatus: batch.status,
  };
};
