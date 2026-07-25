import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import PageView from "./pages/PageView.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<PageView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
