import { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import { BusinessProfile } from "../models/BusinessProfile";
import { SLUG_RE } from "../utils/slug";
import { recordClick, recordScan } from "../utils/stats";

const notAvailable = (res: Response, message = "This page is not available") =>
  res.status(404).json({ success: false, message });

// Public, unauthenticated. Returns ONLY what customers need to see.
export async function getPublicProfile(req: Request, res: Response) {
  const slug = String(req.params.slug ?? "").toLowerCase();
  if (slug.length > 40 || !SLUG_RE.test(slug)) return notAvailable(res);

  const biz = await BusinessProfile.findOne({ slug, isActive: true }).select(
    "businessName description category logoUrl links"
  );
  if (!biz) return notAvailable(res);

  // Analytics must never break the page
  recordScan(biz._id).catch((err) => console.error("[stats] scan failed:", (err as Error).message));

  // Never cache: a scan must always show the latest links.
  res.set("Cache-Control", "no-store");
  res.json({
    success: true,
    data: {
      profileId: String(biz._id),
      businessName: biz.businessName,
      description: biz.description,
      category: biz.category,
      logoUrl: biz.logoUrl,
      links: Array.from(biz.links)
        .filter((l) => l.isActive)
        .sort((a, b) => a.position - b.position)
        .map((l) => ({ id: String(l._id), title: l.title, url: l.url, icon: l.icon })),
    },
  });
}

// Record the click, then redirect to the stored URL.
export async function goToLink(req: Request, res: Response) {
  const { profileId, linkId } = req.params;
  if (!isValidObjectId(profileId) || !isValidObjectId(linkId)) return notAvailable(res, "Link not available");

  const biz = await BusinessProfile.findOne({
    _id: new Types.ObjectId(profileId),
    isActive: true,
    "links._id": new Types.ObjectId(linkId),
  }).select("links");

  const link = biz ? biz.links.id(linkId) : null;
  if (!biz || !link || !link.isActive || !/^https?:\/\//i.test(link.url)) {
    return notAvailable(res, "Link not available");
  }

  recordClick(biz._id, link._id as Types.ObjectId).catch((err) =>
    console.error("[stats] click failed:", (err as Error).message)
  );
  res.set("Cache-Control", "no-store");
  res.redirect(302, link.url);
}
