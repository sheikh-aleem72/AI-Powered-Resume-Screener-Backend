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

    normalizedResumeText: {
      type: String,
      default: null,
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

    passFail: {
      type: String,
      enum: ['passed', 'failed'],
      index: true,
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
      enum: ['pending', 'completed', 'skipped'],
      default: 'pending',
    },

    // ---- Phase 5A: Explanation (derived, human-facing) ----
    explanation: {
      decision: {
        status: {
          type: String,
          enum: ['passed', 'rejected'],
        },
        reasons: {
          type: [String],
          default: [],
        },
      },

      skills: {
        required: {
          type: [String],
          default: [],
        },
        matched: {
          type: [String],
          default: [],
        },
        missing: {
          type: [String],
          default: [],
        },
        optionalMatched: {
          type: [String],
          default: [],
        },
      },

      experience: {
        requiredYears: Number,
        candidateYears: Number,
        meetsRequirement: Boolean,
      },

      // reserved for future (do NOT populate yet)
      education: {
        requiredLevel: String,
        candidateLevel: String,
        meetsRequirement: Boolean,
      },

      scoreBreakdown: {
        components: {
          similarity: {
            score: Number,
            weight: Number,
          },
          requiredSkills: {
            ratio: Number,
            weight: Number,
          },
          preferredSkills: {
            ratio: Number,
            weight: Number,
          },
          experience: {
            ratio: Number,
            weight: Number,
          },
        },
      },
    },
    // ---- Results (filled later) ----
    analysisStatus: {
      type: String,
      enum: ['not_requested', 'queued', 'processing', 'completed', 'failed'],
      default: 'not_requested',
      index: true,
    },

    analysis: {
      type: Schema.Types.Mixed,
      default: null,
    },

    analysisError: {
      type: String,
      default: null,
    },

    analysisRequestedAt: {
      type: Date,
    },

    analysisCompletedAt: {
      type: Date,
    },

    analysisRetryCount: {
      type: Number,
      default: 0,
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
