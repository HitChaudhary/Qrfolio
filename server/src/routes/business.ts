import { RequestHandler, Router } from "express";
import multer from "multer";
import {
  addLink, createBusiness, deleteBusiness, deleteLink, getAnalytics, getBusiness, listBusinesses,
  removeLogo, reorderLinks, updateBusiness, updateLink, uploadLogo,
} from "../controllers/business";
import { requireAuth } from "../middleware/auth";
import { requireCloudinary, requireDb, requireJwtConfig } from "../middleware/guards";
import { asyncHandler } from "../utils/asyncHandler";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG or WEBP images are allowed"));
  },
});

// Turn multer errors into clean 400 responses
const parseLogoFile: RequestHandler = (req, res, next) => {
  upload.single("logo")(req, res, (err: unknown) => {
    if (err) {
      const e = err as { code?: string; message?: string };
      res.status(400).json({
        success: false,
        message: e.code === "LIMIT_FILE_SIZE" ? "Logo must be 2 MB or smaller" : e.message || "Invalid file",
      });
      return;
    }
    next();
  });
};

const router = Router();
router.use(requireDb, requireJwtConfig, requireAuth);

router.post("/", asyncHandler(createBusiness));
router.get("/", asyncHandler(listBusinesses));
router.get("/:id", asyncHandler(getBusiness));
router.get("/:id/analytics", asyncHandler(getAnalytics));
router.put("/:id", asyncHandler(updateBusiness));
router.delete("/:id", asyncHandler(deleteBusiness));

// "reorder" must be registered before "/links/:linkId"
router.post("/:id/links", asyncHandler(addLink));
router.put("/:id/links/reorder", asyncHandler(reorderLinks));
router.put("/:id/links/:linkId", asyncHandler(updateLink));
router.delete("/:id/links/:linkId", asyncHandler(deleteLink));

router.post("/:id/logo", requireCloudinary, parseLogoFile, asyncHandler(uploadLogo));
router.delete("/:id/logo", asyncHandler(removeLogo));

export default router;
