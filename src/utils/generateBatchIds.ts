import { CounterModel } from '../schema/counter.model';

export async function generateBatchId(): Promise<string> {
  const date = new Date();

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const dateKey = `${yyyy}${mm}${dd}`; // e.g., "20250118"
  const counterKey = `batch_${dateKey}`; // e.g., "batch_20250118"

  // Atomic increment (safe for concurrent calls)
  const updated = await CounterModel.findOneAndUpdate(
    { key: counterKey },
    { $inc: { count: 1 } },
    { upsert: true, new: true },
  );

  const countStr = String(updated.count).padStart(4, '0'); // "0001"

  return `BATCH_${dateKey}_${countStr}`;
}
