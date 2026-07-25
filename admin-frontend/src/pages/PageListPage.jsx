import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPages, deletePage } from "../store/pagesSlice.js";

export default function PageListPage() {
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages.items);

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (confirm("Delete this page?")) dispatch(deletePage(id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Link to="/pages/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
          + New Page
        </Link>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Status</th>
              <th className="p-3">Layout</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page._id} className="border-t">
                <td className="p-3 font-medium">{page.title}</td>
                <td className="p-3 text-slate-500">/{page.slug}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      page.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{page.layout}</td>
                <td className="p-3 text-right space-x-3">
                  <Link to={`/pages/${page._id}`} className="text-indigo-600">Edit</Link>
                  <button onClick={() => handleDelete(page._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  No pages yet. Create your first page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
