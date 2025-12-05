import ReportForm from "@/src/components/ReportForm";

export default function ReportPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #fff8e7 60%, #fff 100%)' }}
    >
      <section className="w-full max-w-2xl text-center bg-white/90 rounded-2xl shadow-xl p-10 border border-indigo-100 mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 drop-shadow">Submit a Civic Issue</h1>
        <p className="text-lg text-indigo-900 mb-6">
          Help improve your city by reporting issues like potholes, broken streetlights, or sanitation problems.
        </p>
      </section>
      <div className="w-full max-w-2xl bg-indigo-50/80 rounded-2xl shadow-lg p-8 border border-indigo-100" style={{ background: 'rgba(238, 242, 255, 0.8)' }}>
        <ReportForm />
      </div>
    </main>
  );
} 