import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, username: admin.username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const existing = await AdminUser.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ message: "Username or email already in use" });

    const admin = await AdminUser.create({ username, email, password });
    const token = signToken(admin);
    res.status(201).json({ token, admin: admin.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(admin);
    res.json({ token, admin: admin.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const admin = await AdminUser.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({ admin: admin.toSafeObject() });
  } catch (err) {
    next(err);
  }
}
