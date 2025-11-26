import mongoose, { Document, Schema } from 'mongoose';

export type PendingPurpose = 'signup' | 'resetPassword';

export interface IPendingVerification extends Document {
  email: string;
  // for signup: username + hashedPassword; for reset: these may be undefined
  name?: string | null;
  organization?: string | null;
  password?: string | null;
  otpHash: string;
  purpose: PendingPurpose;
  otpExpiresAt: Date;
  createdAt: Date;
}

const PendingVerificationSchema = new Schema<IPendingVerification>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, default: null },
    organization: { type: String, default: null },
    password: { type: String, default: null },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ['signup', 'reset'], required: true },
    otpExpiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TTL index: automatically remove documents when otpExpiresAt <= now
PendingVerificationSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingVerification = mongoose.model<IPendingVerification>(
  'PendingVerification',
  PendingVerificationSchema,
);
