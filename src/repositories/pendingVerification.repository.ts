import { PendingVerification, IPendingVerification } from '../schema/pendingVerification.model';
import { Types } from 'mongoose';

export const createPending = async (payload: {
  email: string;
  name?: string | null;
  password?: string | null;
  organization?: string | null;
  otpHash: string;
  purpose: 'signup' | 'reset';
  otpExpiresAt: Date;
}): Promise<IPendingVerification> => {
  const doc = new PendingVerification(payload);
  await doc.save();
  return doc;
};

export const findPendingByEmailAndPurpose = async (
  email: string,
  purpose: 'signup' | 'reset',
): Promise<IPendingVerification | null> => {
  return PendingVerification.findOne({ email: email.toLowerCase(), purpose }).exec();
};

export const deletePendingById = async (id: Types.ObjectId) => {
  return PendingVerification.findByIdAndDelete(id).exec();
};

export const deletePendingByEmailAndPurpose = async (
  email: string,
  purpose: 'signup' | 'reset',
) => {
  return PendingVerification.findOneAndDelete({ email: email.toLowerCase(), purpose }).exec();
};
