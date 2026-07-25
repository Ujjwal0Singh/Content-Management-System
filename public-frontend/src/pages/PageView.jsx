import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api.js";
import BlockRenderer from "../components/BlockRenderer.jsx";

export default function PageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(null);
    setError(null);
    api
      .get(`/content/slug/${slug}`)
      .then((res) => setPage(res.data.page))
      .catch(() => setError("Page not found"));
  }, [slug]);

  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!page) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
