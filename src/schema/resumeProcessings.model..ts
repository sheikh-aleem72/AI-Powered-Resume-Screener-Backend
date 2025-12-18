import { Schema, model, Types } from 'mongoose';
import { string } from 'zod';

export type ResumeProcessingStatus =
  | 'queued'
  | 'processing'
  | 'textExtracted'
  | 'normalized'
  | 'dedupChecked'
  | 'completed'
  | 'failed';

const ResumeProcessingSchema = new Schema(
  {
    resumeObjectId: {
      // Represents collection which has meta data of resume
      type: String,
      required: true,
      index: true,
    },

    jobDescriptionId: {
      type: Types.ObjectId,
      ref: 'JobDescription',
      required: true,
      index: true,
    },

    batchId: {
      type: string,
      required: true,
      index: true,
    },

    externalResumeId: {
      type: string,
    },

    resumeUrl: {
      type: string,
      required: true, // Denormalized for worker independence & retry safet
    },

    // ---- Hashing & Dedup ----
    resumeHash: {
      type: String,
      index: true,
    },

    jobHash: {
      type: String,
      index: true,
    },

    isDuplicate: {
      type: Boolean,
      default: false,
    },

    duplicateOf: {
      type: Types.ObjectId,
      ref: 'ResumeProcessing',
      default: null,
    },

    // ---- Status tracking ----
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
      index: true,
    },

    batchAccounted: {
      type: Boolean,
      default: false,
      index: true,
    },
    // ---- Results (filled later) ----
    parsedResume: {
      type: Schema.Types.Mixed,
      default: null,
    },

    analysis: {
      type: Schema.Types.Mixed,
      default: null,
    },

    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Critical compound index for dedup
ResumeProcessingSchema.index(
  { resumeHash: 1, jobHash: 1, status: 1 },
  { name: 'dedup_lookup_idx' },
);

export const ResumeProcessing = model('ResumeProcessing', ResumeProcessingSchema);
