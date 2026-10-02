import { Router } from "express";
import rateLimit from "express-rate-limit";
import { changePassword, login, me, register } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";
import { requireDb, requireJwtConfig } from "../middleware/guards";
import { asyncHandler } from "../utils/asyncHandler";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in a few minutes." },
});

const router = Router();
router.use(requireDb, requireJwtConfig);

router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(me));
router.put("/password", authLimiter, requireAuth, asyncHandler(changePassword));

export default router;
