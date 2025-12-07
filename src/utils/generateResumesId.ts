import { CounterModel } from '../schema/counter.model';

export async function generateResumeId(): Promise<string> {
  const date = new Date();

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const dateKey = `${yyyy}${mm}${dd}`;
  const counterKey = `resume_${dateKey}`;

  const updated = await CounterModel.findOneAndUpdate(
    { key: counterKey },
    { $inc: { count: 1 } },
    { upsert: true, new: true },
  );

  const countStr = String(updated.count).padStart(4, '0');

  return `RESUME_${dateKey}_${countStr}`;
}
