"use client";
import dynamic from "next/dynamic";
import { useAuth } from "@/src/features/AuthContext";
import ReportStatus from "@/src/components/ReportStatus";
import DashboardStats from "@/src/components/DashboardStats";

const MapView = dynamic(() => import("@/src/components/MapView"), { ssr: false });

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 flex flex-col items-center p-8">
      <section className="w-full max-w-4xl text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-indigo-100/50 mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 drop-shadow">Welcome{user ? `, ${user.displayName || user.email}` : ''}!</h1>
        <p className="text-lg text-indigo-800 mb-6">
          This is your dashboard. View, upvote, and comment on city issues, or submit a new report.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <a href="/report" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition">Submit a Report</a>
          <a href="/features" className="bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-6 py-3 rounded-lg border border-indigo-200 transition shadow">See Features</a>
        </div>
      </section>
      <div className="w-full max-w-4xl space-y-8">
        <ReportStatus />
        <DashboardStats />
        <MapView />
      </div>
    </main>
  );
} 