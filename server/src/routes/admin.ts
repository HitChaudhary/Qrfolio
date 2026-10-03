import { Router } from "express";
import {
  deleteBusiness, deleteUser, getAnalytics, getBusiness, getDashboard, getUser,
  listBusinesses, listUsers, updateBusiness, updateUser,
} from "../controllers/admin";
import { authenticateUser, requireAdmin } from "../middleware/auth";
import { requireDb, requireJwtConfig } from "../middleware/guards";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every admin route: valid login (401) AND admin role from the database (403)
router.use(requireDb, requireJwtConfig, authenticateUser, requireAdmin);

router.get("/dashboard", asyncHandler(getDashboard));
router.get("/analytics", asyncHandler(getAnalytics));

router.get("/users", asyncHandler(listUsers));
router.get("/users/:id", asyncHandler(getUser));
router.patch("/users/:id", asyncHandler(updateUser));
router.delete("/users/:id", asyncHandler(deleteUser));

router.get("/businesses", asyncHandler(listBusinesses));
router.get("/businesses/:id", asyncHandler(getBusiness));
router.patch("/businesses/:id", asyncHandler(updateBusiness));
router.delete("/businesses/:id", asyncHandler(deleteBusiness));

export default router;
