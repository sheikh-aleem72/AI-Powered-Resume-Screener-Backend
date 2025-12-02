import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeAnalysis extends Document {
  resumeId: mongoose.Types.ObjectId;
  jobDescriptionId: mongoose.Types.ObjectId;
  score: number;
  fitLevel: 'High' | 'Medium' | 'Low';
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  recommendation: string;
  analyzedAt: Date;
}

const resumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobDescriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    fitLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      trim: true,
    },
    recommendation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const ResumeAnalysisModel = mongoose.model<IResumeAnalysis>(
  'ResumeAnalysis',
  resumeAnalysisSchema,
);
