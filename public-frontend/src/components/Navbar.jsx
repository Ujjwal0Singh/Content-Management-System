import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-indigo-700 text-lg">CMS Site</Link>
      </div>
    </header>
  );
}
