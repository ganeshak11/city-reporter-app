"use client";
import { useState } from "react";
import { useAuth } from "@/src/features/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-indigo-900 tracking-tight drop-shadow flex items-center gap-2 justify-center">
            <span className="text-3xl">🏙️</span> City Reporter
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100/50">
          <h1 className="text-2xl font-bold text-indigo-900 mb-6 text-center">Sign In</h1>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition text-gray-700 bg-white/80"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition text-gray-700 bg-white/80"
                required
              />
            </div>

            {error && (
              <div className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-lg shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          
        </div>
      </div>
    </main>
  );
} 