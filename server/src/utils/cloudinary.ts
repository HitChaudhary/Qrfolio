import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

// Names (never values) of Cloudinary variables that are empty or missing
export function missingCloudinaryVars(): string[] {
  const missing: string[] = [];
  if (!env.cloudinary.cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!env.cloudinary.apiKey) missing.push("CLOUDINARY_API_KEY");
  if (!env.cloudinary.apiSecret) missing.push("CLOUDINARY_API_SECRET");
  return missing;
}

export const isCloudinaryConfigured = (): boolean => missingCloudinaryVars().length === 0;

function configure() {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

export function uploadLogoBuffer(buffer: Buffer): Promise<{ url: string; publicId: string }> {
  configure();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "linkqr/logos",
        resource_type: "image",
        allowed_formats: ["jpg", "png", "webp"],
        transformation: [{ width: 600, height: 600, crop: "limit" }],
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// Best effort: never throws.
export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    configure();
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[cloudinary] delete failed:", (err as Error).message);
  }
}
