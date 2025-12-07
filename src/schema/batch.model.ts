import mongoose, { Schema, Document } from 'mongoose';

export interface IBatch extends Document {
  batchId: string; // assigned by us
  jobDescriptionId: string; // refers to job description
  resumes: string[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  totalResumes: number;
  processedResumes: number;
  completedResumes: number;
  failedResumes: number;

  error?: string;
}

const batchSchema = new Schema<IBatch>(
  {
    batchId: { type: String, required: true, unique: true },
    jobDescriptionId: { type: String, required: true },
    resumes: [{ type: String, required: true }],
    totalResumes: { type: Number, required: true },
    processedResumes: { type: Number, default: 0 },
    completedResumes: { type: Number, default: 0 },
    failedResumes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    error: String,
  },
  { timestamps: true },
);

export const BatchModel = mongoose.model<IBatch>('Batch', batchSchema);
