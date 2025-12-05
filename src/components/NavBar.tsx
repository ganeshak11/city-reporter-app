"use client";
import Link from "next/link";
import { useAuth } from "@/src/features/AuthContext";

export default function NavBar() {
  const { user, signOutUser } = useAuth();

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 shadow-md sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-extrabold text-indigo-900 tracking-tight drop-shadow flex items-center gap-2">
            <span className="text-3xl">🏙️</span> City Reporter
          </Link>
          <div className="hidden md:flex gap-4 ml-8">
            <Link href="/dashboard" className="text-indigo-700 hover:text-indigo-900 font-semibold transition">Dashboard</Link>
            <Link href="/about" className="text-indigo-700 hover:text-indigo-900 font-semibold transition">About</Link>
            <Link href="/features" className="text-indigo-700 hover:text-indigo-900 font-semibold transition">Features</Link>
            <Link href="/contact" className="text-indigo-700 hover:text-indigo-900 font-semibold transition">Contact</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/admin"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
              >
                Admin Panel
              </Link>
              <button
                onClick={signOutUser}
                className="text-indigo-700 hover:text-indigo-900 font-semibold transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
