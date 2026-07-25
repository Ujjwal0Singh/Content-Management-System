import Page from "../models/Page.js";

export async function listPages(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const pages = await Page.find(filter).select("title slug status layout updatedAt").sort({ updatedAt: -1 });
    res.json({ pages });
  } catch (err) {
    next(err);
  }
}

export async function getPageBySlug(req, res, next) {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({ page });
  } catch (err) {
    next(err);
  }
}

export async function getPageById(req, res, next) {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({ page });
  } catch (err) {
    next(err);
  }
}

export async function createPage(req, res, next) {
  try {
    const page = await Page.create({ ...req.body, createdBy: req.admin?.id });
    res.status(201).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function updatePage(req, res, next) {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({ page });
  } catch (err) {
    next(err);
  }
}

export async function deletePage(req, res, next) {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Page deleted" });
  } catch (err) {
    next(err);
  }
}
