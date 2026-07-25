import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BlockEditor from "../components/BlockEditor.jsx";
import { fetchPageById, createPage, updatePage, clearCurrent } from "../store/pagesSlice.js";

const LAYOUTS = ["hero", "grid", "text-section", "formula", "table-page", "custom"];

export default function PageBuilderPage() {
  const { id } = useParams();
  const isNew = !id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector((state) => state.pages.current);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [layout, setLayout] = useState("custom");
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isNew) dispatch(fetchPageById(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (current && !isNew) {
      setTitle(current.title);
      setSlug(current.slug);
      setStatus(current.status);
      setLayout(current.layout);
      setBlocks(current.blocks || []);
    }
  }, [current, isNew]);

  const handleSlugFromTitle = (value) => {
    setTitle(value);
    if (isNew) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleSave = async () => {
    setError(null);
    const payload = { title, slug, status, layout, blocks };
    const action = isNew ? createPage(payload) : updatePage({ id, payload });
    const result = await dispatch(action);
    if (result.error) {
      setError(result.payload || "Something went wrong");
      return;
    }
    navigate("/pages");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{isNew ? "New Page" : "Edit Page"}</h2>

      <div className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={title}
            onChange={(e) => handleSlugFromTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Layout</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            {LAYOUTS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <BlockEditor blocks={blocks} onChange={setBlocks} />

      {error && <p className="text-red-500 text-sm mt-4">{JSON.stringify(error)}</p>}

      <div className="mt-6 flex gap-3">
        <button onClick={handleSave} className="bg-indigo-600 text-white px-5 py-2 rounded-md">
          Save Page
        </button>
        <button onClick={() => navigate("/pages")} className="px-5 py-2 rounded-md border">
          Cancel
        </button>
      </div>
    </div>
  );
}
