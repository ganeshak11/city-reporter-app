"use client";
import { useAuth } from "@/src/features/AuthContext";

export default function AuthHeader() {
  const { user, loading, signOutUser } = useAuth();

  return (
    <header className="w-full flex justify-end items-center p-4 gap-4 bg-gradient-to-r from-blue-50 via-cream-50 to-white shadow-sm">
      {!loading && user && (
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow border border-blue-100">
          <span className="text-sm font-medium text-blue-700">{user.displayName || user.email}</span>
          <button
            onClick={signOutUser}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg border border-blue-200 transition font-semibold shadow-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
