import { Types } from "mongoose";
import { env } from "../config/env";
import { BusinessProfile } from "../models/BusinessProfile";
import { DailyStat } from "../models/DailyStat";

// "YYYY-MM-DD" for the configured timezone (falls back to UTC if the zone is invalid)
export function dayKey(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: env.analyticsTz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

async function bumpDaily(businessId: Types.ObjectId, field: "scans" | "clicks") {
  const filter = { businessId, date: dayKey() };
  const update = { $inc: { [field]: 1 } };
  try {
    await DailyStat.updateOne(filter, update, { upsert: true });
  } catch (err) {
    // Two requests created the day's document at once: retry as a plain increment
    if ((err as { code?: number }).code === 11000) await DailyStat.updateOne(filter, update, { upsert: true });
    else throw err;
  }
}

export async function recordScan(businessId: Types.ObjectId): Promise<void> {
  await Promise.all([
    BusinessProfile.updateOne({ _id: businessId }, { $inc: { scanCount: 1 } }),
    bumpDaily(businessId, "scans"),
  ]);
}

export async function recordClick(businessId: Types.ObjectId, linkId: Types.ObjectId): Promise<void> {
  await Promise.all([
    BusinessProfile.updateOne({ _id: businessId, "links._id": linkId }, { $inc: { "links.$.clickCount": 1 } }),
    bumpDaily(businessId, "clicks"),
  ]);
}
