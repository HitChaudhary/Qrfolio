import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../models/User";

// Usage:  npm run create-admin [-- --promote]
// Reads ADMIN_EMAIL, ADMIN_PASSWORD (and optional ADMIN_NAME) from server/.env.
// Never prints the password.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function main(): Promise<number> {
  const email = env.adminEmail.toLowerCase();
  const password = env.adminPassword;
  const promote = process.argv.includes("--promote");

  if (!EMAIL_RE.test(email)) {
    console.error("ADMIN_EMAIL is missing or not a valid email. Set it in server/.env");
    return 1;
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD is missing or shorter than 8 characters. Set it in server/.env");
    return 1;
  }
  if (!env.mongoUri) {
    console.error("MONGODB_URI is not set in server/.env");
    return 1;
  }

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });

  const existing = await User.findOne({ email }).select("role");
  if (existing) {
    if (existing.role === "admin") {
      console.log(`Admin ${email} already exists. Nothing to do.`);
      return 0;
    }
    if (!promote) {
      console.error(
        `A regular account with ${email} already exists. Use a different ADMIN_EMAIL, or re-run with ` +
          `"npm run create-admin -- --promote" to make that account an admin (its password is not changed).`
      );
      return 1;
    }
    await User.updateOne({ _id: existing._id }, { $set: { role: "admin", isActive: true } });
    console.log(`Promoted ${email} to admin. Its password was not changed.`);
    return 0;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name: env.adminName, email, passwordHash, role: "admin" });
  console.log(`Admin account created: ${email}`);
  return 0;
}

main()
  .then(async (code) => {
    await mongoose.disconnect();
    process.exit(code);
  })
  .catch(async (err) => {
    console.error("create-admin failed:", (err as Error).message);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
  });
