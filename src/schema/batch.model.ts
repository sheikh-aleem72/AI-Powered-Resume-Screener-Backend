import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBatch extends Document {
  batchId: string; // assigned by us
  jobDescriptionId: string; // refers to job description
  resumes: {
    externalResumeId?: string;
    resumeUrl: string;
    resumeProcessingId?: string;
    resumeObjectId: string;
  }[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  totalResumes: number;
  processedResumes: number;
  completedResumes: number;
  failedResumes: number;
  size: number;

  error?: string;
}

const batchSchema = new Schema<IBatch>(
  {
    batchId: { type: String, required: true, unique: true },
    jobDescriptionId: { type: String, required: true },
    resumes: [
      {
        externalResumeId: {
          type: String,
          required: true,
        },
        resumeUrl: {
          type: String,
          required: true,
        },
        resumeProcessingId: {
          type: Types.ObjectId,
          ref: 'ResumeProcessing',
          required: true,
        },
        resumeObjectId: {
          type: Types.ObjectId,
          ref: 'Resume',
        },
      },
    ],
    totalResumes: { type: Number, required: true },
    processedResumes: { type: Number, default: 0 },
    completedResumes: { type: Number, default: 0 },
    failedResumes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    size: { type: Number, required: true },
    error: String,
  },
  { timestamps: true },
);

export const BatchModel = mongoose.model<IBatch>('Batch', batchSchema);
