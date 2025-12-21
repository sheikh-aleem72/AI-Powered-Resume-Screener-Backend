import { Schema, model, Types } from 'mongoose';
import { string } from 'zod';

export type ResumeProcessingStatus = 'queued' | 'processing' | 'completed' | 'failed';

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

    // ---- Embeddings ---------------
    resumeEmbedding: {
      type: [Number], // number[]
      required: false,
      default: undefined,
    },

    jobEmbedding: {
      type: [Number], // number[]
      required: false,
      default: undefined,
    },

    embeddingStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },

    embeddingModel: {
      type: String,
      required: false,
    },

    // ---- Phase 4.3: Pre-filter result ----
    preFilter: {
      passed: {
        type: Boolean,
        default: null,
        index: true,
      },

      similarityScore: {
        type: Number,
        required: false,
      },

      reasons: {
        type: [String],
        default: [],
      },
    },

    // ----  Ranking ----
    finalScore: {
      type: Number,
      required: false,
      index: true,
    },

    rank: {
      type: Number,
      required: false,
      index: true,
    },

    rankingStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
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
