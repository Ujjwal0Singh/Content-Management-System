import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice.js";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col">
        <h1 className="text-lg font-bold mb-6 text-indigo-700">CMS Admin</h1>
        <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/pages" className={linkClass}>Pages</NavLink>
          <NavLink to="/pages/new" className={linkClass}>New Page</NavLink>
        </nav>
        <div className="border-t pt-4 mt-4 text-sm">
          <p className="text-slate-500">Signed in as</p>
          <p className="font-medium">{admin?.username}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-md bg-slate-800 text-white py-1.5 text-sm hover:bg-slate-900"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
