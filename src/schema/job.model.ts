import { Schema, model, Document, Types } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company?: string;
  location?: string;
  required_skills: string[]; // strict required skills
  preferred_skills?: string[]; // nice-to-have
  experience_level?: 'Junior' | 'Mid' | 'Senior' | 'Lead' | string;
  min_experience_years?: number;
  description?: string;
  createdBy?: Types.ObjectId; // recruiter id
  createdAt: Date;
  updatedAt: Date;
  totalResumes: number;
  completedResumes: number;
  failedResumes: number;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true, index: true },
    company: { type: String, trim: true },
    location: { type: String, trim: true },
    required_skills: { type: [String], required: true, index: true },
    preferred_skills: { type: [String], default: [] },
    experience_level: { type: String },
    min_experience_years: { type: Number, default: 0 },
    description: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // DENORMALIZED DASHBOARD FIELDS
    totalResumes: { type: Number, default: 0 },
    completedResumes: { type: Number, default: 0 },
    failedResumes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Text index for search (title + description)
JobSchema.index({ title: 'text', description: 'text' });

export const JobModel = model<IJob>('Job', JobSchema);
