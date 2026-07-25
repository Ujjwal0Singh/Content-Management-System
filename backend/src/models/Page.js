import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["header", "text", "list", "table", "math", "image"],
      required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { _id: true }
);

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    layout: {
      type: String,
      enum: ["hero", "grid", "text-section", "formula", "table-page", "custom"],
      default: "custom",
    },
    blocks: { type: [blockSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true }
);

export default mongoose.model("Page", pageSchema);
