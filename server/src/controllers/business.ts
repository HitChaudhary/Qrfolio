import { Response } from "express";
import { HydratedDocument, Types, isValidObjectId } from "mongoose";
import { AuthRequest } from "../middleware/auth";
import { BusinessProfile, IBusiness } from "../models/BusinessProfile";
import { DailyStat } from "../models/DailyStat";
import { deleteImage, uploadLogoBuffer } from "../utils/cloudinary";
import { SLUG_RE, uniqueSlug } from "../utils/slug";
import { dayKey } from "../utils/stats";
import { LINK_ICONS, normalizeUrl, urlErrorMessage } from "../utils/url";

type BusinessDoc = HydratedDocument<IBusiness>;
type Body = Record<string, unknown>;

const fail = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });
const notFound = (res: Response, what = "Business") => fail(res, 404, `${what} not found`);
const isDuplicateKey = (err: unknown) => (err as { code?: number }).code === 11000;

export function serializeBusiness(b: BusinessDoc) {
  const links = Array.from(b.links)
    .sort((a, c) => a.position - c.position)
    .map((l) => ({
      id: String(l._id),
      title: l.title,
      url: l.url,
      icon: l.icon,
      isActive: l.isActive,
      position: l.position,
    }));
  return {
    id: b.id as string,
    businessName: b.businessName,
    description: b.description,
    category: b.category,
    slug: b.slug,
    logoUrl: b.logoUrl,
    links,
    scanCount: b.scanCount,
    isActive: b.isActive,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

// Ownership check: only returns a business that belongs to the logged-in user.
async function findOwned(req: AuthRequest): Promise<BusinessDoc | null> {
  const { id } = req.params;
  if (!req.userId || !isValidObjectId(id)) return null;
  return BusinessProfile.findOne({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(req.userId),
  });
}

async function saveWithSlugCheck(biz: BusinessDoc, res: Response): Promise<boolean> {
  try {
    await biz.save();
    return true;
  } catch (err) {
    if (isDuplicateKey(err)) {
      fail(res, 409, "This URL is already taken. Choose a different one.");
      return false;
    }
    throw err;
  }
}

// ---------- Business ----------
interface Fields {
  businessName?: string;
  description?: string;
  category?: string;
  slug?: string;
  isActive?: boolean;
}

function readFields(body: Body, partial: boolean): { error: string } | { value: Fields } {
  const value: Fields = {};

  if (!partial || body.businessName !== undefined) {
    const name = String(body.businessName ?? "").trim();
    if (name.length < 2 || name.length > 80) return { error: "Business name must be 2 to 80 characters" };
    value.businessName = name;
  }
  if (body.description !== undefined) {
    const d = String(body.description).trim();
    if (d.length > 300) return { error: "Description must be 300 characters or fewer" };
    value.description = d;
  }
  if (body.category !== undefined) {
    const c = String(body.category).trim();
    if (c.length > 40) return { error: "Category must be 40 characters or fewer" };
    value.category = c;
  }
  if (body.slug !== undefined && String(body.slug).trim() !== "") {
    const s = String(body.slug).trim().toLowerCase();
    if (s.length < 3 || s.length > 40 || !SLUG_RE.test(s)) {
      return { error: "URL must be 3 to 40 characters: lowercase letters, numbers and single hyphens" };
    }
    value.slug = s;
  }
  if (typeof body.isActive === "boolean") value.isActive = body.isActive;
  return { value };
}

export async function createBusiness(req: AuthRequest, res: Response) {
  if (!req.userId) return fail(res, 401, "Not authenticated");
  const userId = new Types.ObjectId(req.userId);

  if (await BusinessProfile.exists({ userId })) {
    return fail(res, 409, "You already have a business profile");
  }
  const parsed = readFields((req.body ?? {}) as Body, false);
  if ("error" in parsed) return fail(res, 400, parsed.error);
  const v = parsed.value;

  let slug = v.slug;
  if (slug) {
    if (await BusinessProfile.exists({ slug })) return fail(res, 409, "This URL is already taken. Choose a different one.");
  } else {
    slug = await uniqueSlug(v.businessName as string);
  }

  const biz = new BusinessProfile({
    userId,
    businessName: v.businessName,
    description: v.description ?? "",
    category: v.category ?? "",
    slug,
  });
  if (!(await saveWithSlugCheck(biz, res))) return;
  res.status(201).json({ success: true, data: { business: serializeBusiness(biz) } });
}

export async function listBusinesses(req: AuthRequest, res: Response) {
  if (!req.userId) return fail(res, 401, "Not authenticated");
  const docs = await BusinessProfile.find({ userId: new Types.ObjectId(req.userId) });
  res.json({ success: true, data: { businesses: docs.map(serializeBusiness) } });
}

export async function getBusiness(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);
  res.json({ success: true, data: { business: serializeBusiness(biz) } });
}

export async function updateBusiness(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);

  const parsed = readFields((req.body ?? {}) as Body, true);
  if ("error" in parsed) return fail(res, 400, parsed.error);
  const v = parsed.value;

  if (v.slug && v.slug !== biz.slug && (await BusinessProfile.exists({ slug: v.slug }))) {
    return fail(res, 409, "This URL is already taken. Choose a different one.");
  }
  biz.set(v);
  if (!(await saveWithSlugCheck(biz, res))) return;
  res.json({ success: true, data: { business: serializeBusiness(biz) } });
}

export async function deleteBusiness(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);
  await deleteImage(biz.logoPublicId);
  await DailyStat.deleteMany({ businessId: biz._id });
  await biz.deleteOne();
  res.json({ success: true, data: {} });
}

// ---------- Links ----------
interface LinkValues {
  title: string;
  url: string;
  icon: string;
}

function readLink(body: Body, existing?: LinkValues): { error: string } | { value: LinkValues } {
  const icon = body.icon !== undefined ? String(body.icon) : existing?.icon ?? "custom";
  if (!LINK_ICONS.includes(icon)) return { error: "Unknown link type" };

  const title = body.title !== undefined ? String(body.title).trim() : existing?.title ?? "";
  if (title.length < 1 || title.length > 60) return { error: "Title must be 1 to 60 characters" };

  const rawUrl = body.url !== undefined ? String(body.url) : existing?.url ?? "";
  const url = normalizeUrl(rawUrl, icon);
  if (!url) return { error: urlErrorMessage(icon) };

  return { value: { title, url, icon } };
}

const respondWithBusiness = (res: Response, biz: BusinessDoc, status = 200) =>
  res.status(status).json({ success: true, data: { business: serializeBusiness(biz) } });

export async function addLink(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);

  const parsed = readLink((req.body ?? {}) as Body);
  if ("error" in parsed) return fail(res, 400, parsed.error);

  const position = biz.links.reduce((max, l) => Math.max(max, l.position), -1) + 1;
  biz.links.push({ ...parsed.value, isActive: true, position, clickCount: 0 });
  await biz.save();
  respondWithBusiness(res, biz, 201);
}

export async function updateLink(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);

  const { linkId } = req.params;
  const link = isValidObjectId(linkId) ? biz.links.id(linkId) : null;
  if (!link) return notFound(res, "Link");

  const body = (req.body ?? {}) as Body;
  const parsed = readLink(body, { title: link.title, url: link.url, icon: link.icon });
  if ("error" in parsed) return fail(res, 400, parsed.error);

  link.title = parsed.value.title;
  link.url = parsed.value.url;
  link.icon = parsed.value.icon;
  if (typeof body.isActive === "boolean") link.isActive = body.isActive;
  await biz.save();
  respondWithBusiness(res, biz);
}

export async function deleteLink(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);

  const { linkId } = req.params;
  const link = isValidObjectId(linkId) ? biz.links.id(linkId) : null;
  if (!link) return notFound(res, "Link");

  biz.links.pull({ _id: link._id });
  Array.from(biz.links)
    .sort((a, b) => a.position - b.position)
    .forEach((l, i) => {
      l.position = i;
    });
  await biz.save();
  respondWithBusiness(res, biz);
}

export async function reorderLinks(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);

  const order = (req.body as Body | undefined)?.order;
  if (!Array.isArray(order)) return fail(res, 400, "Invalid link order");
  const ids = order.map(String);
  const existing = new Set(biz.links.map((l) => String(l._id)));
  if (ids.length !== existing.size || new Set(ids).size !== ids.length || !ids.every((id) => existing.has(id))) {
    return fail(res, 400, "Invalid link order");
  }

  ids.forEach((id, index) => {
    const link = biz.links.id(id);
    if (link) link.position = index;
  });
  await biz.save();
  respondWithBusiness(res, biz);
}

// ---------- Logo ----------
export async function uploadLogo(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);
  if (!req.file) return fail(res, 400, "Choose an image to upload");

  let uploaded: { url: string; publicId: string };
  try {
    uploaded = await uploadLogoBuffer(req.file.buffer);
  } catch (err) {
    console.error("[cloudinary] upload failed:", (err as Error).message);
    return fail(res, 502, "Logo upload failed. Please try again.");
  }

  const oldPublicId = biz.logoPublicId;
  biz.logoUrl = uploaded.url;
  biz.logoPublicId = uploaded.publicId;
  try {
    await biz.save();
  } catch (err) {
    await deleteImage(uploaded.publicId);
    throw err;
  }
  if (oldPublicId) await deleteImage(oldPublicId);
  respondWithBusiness(res, biz);
}

export async function removeLogo(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);

  const oldPublicId = biz.logoPublicId;
  biz.logoUrl = "";
  biz.logoPublicId = "";
  await biz.save();
  await deleteImage(oldPublicId);
  respondWithBusiness(res, biz);
}

// ---------- Analytics ----------
export async function getAnalytics(req: AuthRequest, res: Response) {
  const biz = await findOwned(req);
  if (!biz) return notFound(res);

  const today = dayKey();
  const monthStart = `${today.slice(0, 7)}-01`;
  const rows = await DailyStat.find({ businessId: biz._id, date: { $gte: monthStart } });

  const links = Array.from(biz.links)
    .sort((a, b) => a.position - b.position)
    .map((l) => ({ id: String(l._id), title: l.title, icon: l.icon, clicks: l.clickCount ?? 0 }));

  res.json({
    success: true,
    data: {
      totalScans: biz.scanCount,
      today: rows.find((r) => r.date === today)?.scans ?? 0,
      thisMonth: rows.reduce((sum, r) => sum + r.scans, 0),
      totalClicks: links.reduce((sum, l) => sum + l.clicks, 0),
      links,
    },
  });
}
