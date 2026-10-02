import { Schema, Types, model } from "mongoose";

// One document per business per day. Stores counts only, no personal data.
export interface IDailyStat {
  businessId: Types.ObjectId;
  date: string; // YYYY-MM-DD in ANALYTICS_TIMEZONE
  scans: number;
  clicks: number;
}

const dailyStatSchema = new Schema<IDailyStat>({
  businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
  date: { type: String, required: true },
  scans: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
});
dailyStatSchema.index({ businessId: 1, date: 1 }, { unique: true });

export const DailyStat = model<IDailyStat>("DailyStat", dailyStatSchema);
