import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { IUser, User } from "../models/User";
import { signToken } from "../utils/token";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u: IUser) => ({ id: u.id as string, name: u.name, email: u.email });

const fail = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

export async function register(req: Request, res: Response) {
  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (name.length < 2 || name.length > 60) return fail(res, 400, "Name must be 2 to 60 characters");
  if (!EMAIL_RE.test(email)) return fail(res, 400, "Enter a valid email address");
  if (password.length < 8) return fail(res, 400, "Password must be at least 8 characters");

  if (await User.exists({ email })) return fail(res, 409, "An account with this email already exists");

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ success: true, data: { token: signToken(user.id), user: publicUser(user) } });
  } catch (err) {
    // Race condition: duplicate email created between the check and the insert
    if ((err as { code?: number }).code === 11000) {
      return fail(res, 409, "An account with this email already exists");
    }
    throw err;
  }
}

export async function login(req: Request, res: Response) {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) return fail(res, 400, "Email and password are required");

  const user = await User.findOne({ email }).select("+passwordHash");
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) return fail(res, 401, "Invalid email or password");

  res.json({ success: true, data: { token: signToken(user.id), user: publicUser(user) } });
}

export async function changePassword(req: AuthRequest, res: Response) {
  const currentPassword = String(req.body?.currentPassword ?? "");
  const newPassword = String(req.body?.newPassword ?? "");
  if (newPassword.length < 8) return fail(res, 400, "New password must be at least 8 characters");

  const user = await User.findById(req.userId).select("+passwordHash");
  if (!user) return fail(res, 401, "Account no longer exists. Please log in again.");
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return fail(res, 400, "Current password is incorrect");
  }
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ success: true, data: {} });
}

export async function me(req: AuthRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) return fail(res, 401, "Account no longer exists. Please log in again.");
  res.json({ success: true, data: { user: publicUser(user) } });
}
