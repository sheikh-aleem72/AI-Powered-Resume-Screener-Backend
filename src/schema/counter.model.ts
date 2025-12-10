import mongoose, { Schema, Document } from 'mongoose';

export interface ICounter extends Document {
  key: string; // e.g., "batch_20250118"
  count: number; // incremental counter
}

const counterSchema = new Schema<ICounter>({
  key: { type: String, unique: true, required: true },
  count: { type: Number, default: 0 },
});

export const CounterModel = mongoose.model<ICounter>('Counter', counterSchema);
