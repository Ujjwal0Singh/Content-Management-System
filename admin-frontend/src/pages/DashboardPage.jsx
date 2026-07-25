import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPages } from "../store/pagesSlice.js";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages.items);

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const published = pages.filter((p) => p.status === "published").length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <p className="text-slate-500 text-sm">Total pages</p>
          <p className="text-3xl font-bold">{pages.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <p className="text-slate-500 text-sm">Published</p>
          <p className="text-3xl font-bold text-green-600">{published}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <p className="text-slate-500 text-sm">Drafts</p>
          <p className="text-3xl font-bold text-amber-600">{pages.length - published}</p>
        </div>
      </div>
    </div>
  );
}
