import { BatchModel, IBatch } from '../schema/batch.model';

export const createBatch = async (data: Partial<IBatch>) => {
  const batch = new BatchModel(data);
  return await batch.save();
};

export const updateBatchStatus = async (batchId: string, update: Partial<IBatch>) => {
  const newBatch = await BatchModel.findOneAndUpdate({ batchId }, update, { new: true });

  return newBatch;
};
