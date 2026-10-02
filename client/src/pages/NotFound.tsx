import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-slate-600">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-sm font-medium underline">Go home</Link>
    </main>
  );
}
