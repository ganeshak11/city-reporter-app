import Image from "next/image";
import IssueCount from "@/src/components/IssueCount";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 p-8">
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 drop-shadow">The City Reporter</h1>
        <p className="text-lg text-gray-700 mb-8">
          A modern platform for reporting and tracking local civic issues like potholes, broken streetlights, and sanitation problems. Empower your community and help make your city better!
        </p>
        <a href="/report" className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold px-8 py-3 rounded-lg shadow transition mb-8">
          Submit a Report
        </a>
        <div className="my-8 flex justify-center">
          <IssueCount />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3 text-left">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-6 border border-indigo-100/50 hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">Easy Reporting</h2>
            <p className="text-gray-600">Submit issues with a photo, description, and map location in seconds.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-6 border border-indigo-100/50 hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">Live Map & Dashboard</h2>
            <p className="text-gray-600">See all reported issues on a real-time map. Filter by category and status.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow p-6 border border-indigo-100/50 hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">Admin Tools</h2>
            <p className="text-gray-600">Admins can update status, add notes, and notify users about progress.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
