import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PageListPage from "./pages/PageListPage.jsx";
import PageBuilderPage from "./pages/PageBuilderPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pages" element={<PageListPage />} />
          <Route path="/pages/new" element={<PageBuilderPage />} />
          <Route path="/pages/:id" element={<PageBuilderPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
