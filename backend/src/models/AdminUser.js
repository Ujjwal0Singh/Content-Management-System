import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true }
);

adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminUserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminUserSchema.methods.toSafeObject = function () {
  return { id: this._id, username: this.username, email: this.email, role: this.role };
};

export default mongoose.model("AdminUser", adminUserSchema);
