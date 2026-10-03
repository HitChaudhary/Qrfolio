import { Response } from "express";
import { HydratedDocument, Types } from "mongoose";
import { AuthRequest } from "../middleware/auth";
import { BusinessProfile, IBusiness } from "../models/BusinessProfile";
import { DailyStat } from "../models/DailyStat";
import { IUser, User } from "../models/User";
import { deleteImage } from "../utils/cloudinary";
import { dayKey } from "../utils/stats";

type BusinessDoc = HydratedDocument<IBusiness>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Query = Record<string, any>;
interface OwnerInfo {
  id: string;
  name: string;
  email: string;
}

const fail = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

// ---------- helpers ----------
const ID_RE = /^[a-f\d]{24}$/i;
const parseId = (raw: unknown): Types.ObjectId | null =>
  typeof raw === "string" && ID_RE.test(raw) ? new Types.ObjectId(raw) : null;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Query params are coerced to strings, so objects like ?search[$ne]= can't reach MongoDB
const qs = (req: AuthRequest, key: string) => String(req.query[key] ?? "").trim();

function searchRegex(req: AuthRequest): RegExp | null {
  const q = qs(req, "search").slice(0, 80);
  return q ? new RegExp(escapeRegex(q), "i") : null;
}

function pageParams(req: AuthRequest) {
  const page = Math.max(1, parseInt(qs(req, "page"), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(qs(req, "limit"), 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

const paginated = <T>(items: T[], total: number, page: number, limit: number) => ({
  items,
  total,
  page,
  pages: Math.max(1, Math.ceil(total / limit)),
});

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// Never includes passwordHash or any token. Accounts created before roles existed
// have no role/isActive field, so missing values mean "user" and "active".
const userDto = (u: IUser) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  role: u.role === "admin" ? "admin" : "user",
  isActive: u.isActive !== false,
  createdAt: u.createdAt,
  lastLoginAt: u.lastLoginAt ?? null,
});

async function ownersFor(userIds: Types.ObjectId[]): Promise<Map<string, OwnerInfo>> {
  const unique = Array.from(new Set(userIds.map(String))).map((id) => new Types.ObjectId(id));
  const users = unique.length ? await User.find({ _id: { $in: unique } }).select("name email") : [];
  return new Map<string, OwnerInfo>(
    users.map((u): [string, OwnerInfo] => [String(u._id), { id: String(u._id), name: u.name, email: u.email }])
  );
}

const BUSINESS_LIST_FIELDS = "businessName slug category logoUrl isActive scanCount links createdAt userId";

// logoPublicId and other internals are never exposed
const businessSummary = (b: BusinessDoc, owners?: Map<string, OwnerInfo>) => ({
  id: String(b._id),
  businessName: b.businessName,
  slug: b.slug,
  category: b.category,
  logoUrl: b.logoUrl,
  isActive: b.isActive,
  scanCount: b.scanCount,
  linkCount: b.links.length,
  createdAt: b.createdAt,
  owner: owners?.get(String(b.userId)) ?? null,
});

// Removes a business and everything that belongs to it
async function removeBusinesses(filter: Query) {
  const businesses = await BusinessProfile.find(filter).select("logoPublicId");
  for (const b of businesses) await deleteImage(b.logoPublicId);
  await DailyStat.deleteMany({ businessId: { $in: businesses.map((b) => b._id) } });
  await BusinessProfile.deleteMany(filter);
}

// ---------- dashboard ----------
export async function getDashboard(_req: AuthRequest, res: Response) {
  const since = daysAgo(7);
  const [totalUsers, totalBusinesses, activeBusinesses, scanAgg, newUsers, newBusinesses, recentUsers, recentBusinesses] =
    await Promise.all([
      User.countDocuments(),
      BusinessProfile.countDocuments(),
      BusinessProfile.countDocuments({ isActive: true }),
      BusinessProfile.aggregate<{ _id: null; scans: number }>([
        { $group: { _id: null, scans: { $sum: "$scanCount" } } },
      ]),
      User.countDocuments({ createdAt: { $gte: since } }),
      BusinessProfile.countDocuments({ createdAt: { $gte: since } }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role isActive createdAt lastLoginAt"),
      BusinessProfile.find().sort({ createdAt: -1 }).limit(5).select(BUSINESS_LIST_FIELDS),
    ]);

  const owners = await ownersFor(recentBusinesses.map((b) => b.userId));
  res.json({
    success: true,
    data: {
      totalUsers,
      totalBusinesses,
      activeBusinesses,
      inactiveBusinesses: totalBusinesses - activeBusinesses,
      totalScans: scanAgg[0]?.scans ?? 0,
      newUsers,
      newBusinesses,
      recentUsers: recentUsers.map(userDto),
      recentBusinesses: recentBusinesses.map((b) => businessSummary(b, owners)),
    },
  });
}

// ---------- users ----------
export async function listUsers(req: AuthRequest, res: Response) {
  const { page, limit, skip } = pageParams(req);
  const filter: Query = {};

  const re = searchRegex(req);
  if (re) filter.$or = [{ name: re }, { email: re }];

  const role = qs(req, "role");
  if (role === "admin") filter.role = "admin";
  else if (role === "user") filter.role = { $ne: "admin" };

  const status = qs(req, "status");
  if (status === "active") filter.isActive = { $ne: false };
  else if (status === "inactive") filter.isActive = false;

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name email role isActive createdAt lastLoginAt"),
  ]);

  const counts = await BusinessProfile.aggregate<{ _id: Types.ObjectId; count: number }>([
    { $match: { userId: { $in: users.map((u) => u._id) } } },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]);
  const countById = new Map<string, number>(counts.map((c): [string, number] => [String(c._id), c.count]));

  res.json({
    success: true,
    data: paginated(
      users.map((u) => ({ ...userDto(u), businessCount: countById.get(String(u._id)) ?? 0 })),
      total,
      page,
      limit
    ),
  });
}

export async function getUser(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) return fail(res, 400, "Invalid user id");

  const user = await User.findById(id).select("name email role isActive createdAt lastLoginAt");
  if (!user) return fail(res, 404, "User not found");

  const businesses = await BusinessProfile.find({ userId: id }).sort({ createdAt: -1 }).select(BUSINESS_LIST_FIELDS);
  res.json({
    success: true,
    data: {
      user: { ...userDto(user), businessCount: businesses.length },
      businesses: businesses.map((b) => businessSummary(b)),
    },
  });
}

export async function updateUser(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) return fail(res, 400, "Invalid user id");
  // Because an admin can never change their own account, at least one active admin always remains
  if (String(id) === req.userId) return fail(res, 403, "You can't change your own role or status");

  const body = (req.body ?? {}) as Query;
  const update: { role?: "user" | "admin"; isActive?: boolean } = {};

  const role = body.role;
  if (role !== undefined) {
    if (role !== "user" && role !== "admin") return fail(res, 400, "Invalid role");
    update.role = role;
  }
  const isActive = body.isActive;
  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") return fail(res, 400, "Invalid status");
    update.isActive = isActive;
  }
  if (Object.keys(update).length === 0) return fail(res, 400, "Nothing to update");

  const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select(
    "name email role isActive createdAt lastLoginAt"
  );
  if (!user) return fail(res, 404, "User not found");
  res.json({ success: true, data: { user: userDto(user) } });
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) return fail(res, 400, "Invalid user id");
  if (String(id) === req.userId) return fail(res, 403, "You can't delete your own account");

  const user = await User.findById(id).select("role");
  if (!user) return fail(res, 404, "User not found");
  if (user.role === "admin") return fail(res, 400, "Remove this user's admin role before deleting the account");

  await removeBusinesses({ userId: id });
  await User.deleteOne({ _id: id });
  res.json({ success: true, data: {} });
}

// ---------- businesses ----------
export async function listBusinesses(req: AuthRequest, res: Response) {
  const { page, limit, skip } = pageParams(req);
  const filter: Query = {};

  const re = searchRegex(req);
  if (re) {
    const owners = await User.find({ $or: [{ name: re }, { email: re }] }).select("_id").limit(200);
    filter.$or = [
      { businessName: re },
      { slug: re },
      { category: re },
      { userId: { $in: owners.map((o) => o._id) } },
    ];
  }

  const status = qs(req, "status");
  if (status === "active") filter.isActive = true;
  else if (status === "inactive") filter.isActive = false;

  const [total, businesses] = await Promise.all([
    BusinessProfile.countDocuments(filter),
    BusinessProfile.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select(BUSINESS_LIST_FIELDS),
  ]);

  const owners = await ownersFor(businesses.map((b) => b.userId));
  res.json({
    success: true,
    data: paginated(businesses.map((b) => businessSummary(b, owners)), total, page, limit),
  });
}

export async function getBusiness(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) return fail(res, 400, "Invalid business id");

  const biz = await BusinessProfile.findById(id);
  if (!biz) return fail(res, 404, "Business not found");

  const today = dayKey();
  const monthStart = `${today.slice(0, 7)}-01`;
  const [owners, rows] = await Promise.all([
    ownersFor([biz.userId]),
    DailyStat.find({ businessId: biz._id, date: { $gte: monthStart } }),
  ]);

  const links = Array.from(biz.links)
    .sort((a, b) => a.position - b.position)
    .map((l) => ({
      id: String(l._id),
      title: l.title,
      url: l.url,
      icon: l.icon,
      isActive: l.isActive,
      position: l.position,
      clicks: l.clickCount ?? 0,
    }));

  res.json({
    success: true,
    data: {
      business: {
        id: String(biz._id),
        businessName: biz.businessName,
        description: biz.description,
        category: biz.category,
        slug: biz.slug,
        logoUrl: biz.logoUrl,
        isActive: biz.isActive,
        createdAt: biz.createdAt,
        updatedAt: biz.updatedAt,
        owner: owners.get(String(biz.userId)) ?? null,
      },
      links,
      analytics: {
        totalScans: biz.scanCount,
        today: rows.find((r) => r.date === today)?.scans ?? 0,
        thisMonth: rows.reduce((sum, r) => sum + r.scans, 0),
        totalClicks: links.reduce((sum, l) => sum + l.clicks, 0),
      },
    },
  });
}

export async function updateBusiness(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) return fail(res, 400, "Invalid business id");

  const isActive = ((req.body ?? {}) as Query).isActive;
  if (typeof isActive !== "boolean") return fail(res, 400, "isActive must be true or false");

  const biz = await BusinessProfile.findByIdAndUpdate(id, { $set: { isActive } }, { new: true }).select(
    BUSINESS_LIST_FIELDS
  );
  if (!biz) return fail(res, 404, "Business not found");

  const owners = await ownersFor([biz.userId]);
  res.json({ success: true, data: { business: businessSummary(biz, owners) } });
}

export async function deleteBusiness(req: AuthRequest, res: Response) {
  const id = parseId(req.params.id);
  if (!id) return fail(res, 400, "Invalid business id");
  if (!(await BusinessProfile.exists({ _id: id }))) return fail(res, 404, "Business not found");

  await removeBusinesses({ _id: id });
  res.json({ success: true, data: {} });
}

// ---------- analytics ----------
export async function getAnalytics(_req: AuthRequest, res: Response) {
  const today = dayKey();
  const monthStart = `${today.slice(0, 7)}-01`;

  // Last 14 calendar days (oldest first) in the configured analytics timezone
  const keys: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const key = dayKey(daysAgo(i));
    if (!keys.includes(key)) keys.push(key);
  }

  const [scanAgg, clickAgg, dailyAgg, monthAgg, top] = await Promise.all([
    BusinessProfile.aggregate<{ _id: null; scans: number }>([
      { $group: { _id: null, scans: { $sum: "$scanCount" } } },
    ]),
    BusinessProfile.aggregate<{ _id: null; clicks: number }>([
      { $project: { c: { $sum: "$links.clickCount" } } },
      { $group: { _id: null, clicks: { $sum: "$c" } } },
    ]),
    DailyStat.aggregate<{ _id: string; scans: number; clicks: number }>([
      { $match: { date: { $in: keys } } },
      { $group: { _id: "$date", scans: { $sum: "$scans" }, clicks: { $sum: "$clicks" } } },
    ]),
    DailyStat.aggregate<{ _id: null; scans: number; clicks: number }>([
      { $match: { date: { $gte: monthStart } } },
      { $group: { _id: null, scans: { $sum: "$scans" }, clicks: { $sum: "$clicks" } } },
    ]),
    BusinessProfile.find({ scanCount: { $gt: 0 } }).sort({ scanCount: -1 }).limit(10).select(BUSINESS_LIST_FIELDS),
  ]);

  const byDate = new Map<string, { scans: number; clicks: number }>(
    dailyAgg.map((d): [string, { scans: number; clicks: number }] => [d._id, d])
  );
  const daily = keys.map((date) => ({
    date,
    scans: byDate.get(date)?.scans ?? 0,
    clicks: byDate.get(date)?.clicks ?? 0,
  }));

  const owners = await ownersFor(top.map((b) => b.userId));
  res.json({
    success: true,
    data: {
      totalScans: scanAgg[0]?.scans ?? 0,
      today: byDate.get(today)?.scans ?? 0,
      thisMonth: monthAgg[0]?.scans ?? 0,
      totalClicks: clickAgg[0]?.clicks ?? 0,
      clicksThisMonth: monthAgg[0]?.clicks ?? 0,
      daily,
      topBusinesses: top.map((b) => ({
        id: String(b._id),
        businessName: b.businessName,
        slug: b.slug,
        isActive: b.isActive,
        scans: b.scanCount,
        clicks: b.links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0),
        owner: owners.get(String(b.userId))?.name ?? null,
      })),
    },
  });
}
