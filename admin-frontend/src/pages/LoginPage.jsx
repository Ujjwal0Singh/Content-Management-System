import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-indigo-700">CMS Admin Login</h1>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded-md px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded-md px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
