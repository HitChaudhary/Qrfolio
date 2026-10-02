import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getPublicProfile, goToLink } from "../controllers/public";
import { requireDb } from "../middleware/guards";
import { asyncHandler } from "../utils/asyncHandler";

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again shortly." },
});

// GET /api/public/:slug
const router = Router();
router.get("/:slug", publicLimiter, requireDb, asyncHandler(getPublicProfile));
export default router;

// GET /api/go/:profileId/:linkId
export const goRouter = Router();
goRouter.get("/:profileId/:linkId", publicLimiter, requireDb, asyncHandler(goToLink));
