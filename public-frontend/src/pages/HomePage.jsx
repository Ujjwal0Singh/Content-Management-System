import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api.js";

export default function HomePage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/content", { params: { status: "published" } })
      .then((res) => setPages(res.data.pages))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Published Pages</h1>
      <div className="grid gap-4">
        {pages.map((page) => (
          <Link
            key={page._id}
            to={`/${page.slug}`}
            className="block bg-white border rounded-lg p-5 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-indigo-700">{page.title}</h2>
            <p className="text-sm text-slate-500 mt-1">/{page.slug} · {page.layout}</p>
          </Link>
        ))}
        {pages.length === 0 && <p className="text-slate-400">No published pages yet.</p>}
      </div>
    </div>
  );
}
