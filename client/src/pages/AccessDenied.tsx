import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { primaryBtn } from "../lib/ui";

export default function AccessDenied() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4f4f4] p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <ShieldAlert size={30} />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-[#284737]">Access denied</h1>
      <p className="mt-2 max-w-sm text-sm text-[#70a087]">
        You don't have permission to open the admin panel. If you think this is a mistake, contact an administrator.
      </p>
      <Link to="/dashboard" className={`${primaryBtn} mt-6`}>Back to my dashboard</Link>
    </main>
  );
}
