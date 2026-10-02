import { Schema, Types, model } from "mongoose";

export interface ILink {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  position: number;
  clickCount: number;
}

export interface IBusiness {
  userId: Types.ObjectId;
  businessName: string;
  description: string;
  category: string;
  slug: string;
  logoUrl: string;
  logoPublicId: string;
  links: Types.DocumentArray<ILink>;
  scanCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<ILink>({
  title: { type: String, required: true, trim: true, maxlength: 60 },
  url: { type: String, required: true, maxlength: 2000 },
  icon: { type: String, default: "custom" },
  isActive: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
});

const businessSchema = new Schema<IBusiness>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    businessName: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", trim: true, maxlength: 300 },
    category: { type: String, default: "", trim: true, maxlength: 40 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logoUrl: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
    links: { type: [linkSchema], default: [] },
    scanCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BusinessProfile = model<IBusiness>("BusinessProfile", businessSchema);
