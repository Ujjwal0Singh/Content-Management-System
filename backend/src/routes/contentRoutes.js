import { Router } from "express";
import {
  listPages,
  getPageBySlug,
  getPageById,
  createPage,
  updatePage,
  deletePage,
} from "../controllers/contentController.js";
import { validate } from "../middleware/validate.js";
import { pageSchema, pageUpdateSchema } from "../utils/validators.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// public reads
router.get("/", listPages);
router.get("/slug/:slug", getPageBySlug);

// admin-only writes
router.get("/:id", requireAuth, getPageById);
router.post("/", requireAuth, validate(pageSchema), createPage);
router.put("/:id", requireAuth, validate(pageUpdateSchema), updatePage);
router.delete("/:id", requireAuth, deletePage);

export default router;
