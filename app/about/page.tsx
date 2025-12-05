export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 flex flex-col items-center justify-center p-8">
      <section className="max-w-2xl text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-indigo-100/50">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 drop-shadow">About City Reporter</h1>
        <p className="text-lg text-indigo-800 mb-6">
          City Reporter is a modern civic platform empowering communities to report and track local issues like potholes, lighting, and sanitation. Our mission is to make cities cleaner, safer, and more responsive—one report at a time.
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Our Team</h2>
          <p className="text-indigo-800 mb-6">
            We are a passionate group of developers, designers, and city lovers dedicated to improving urban life through technology and community engagement.
          </p>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Key Features</h2>
          <ul className="text-indigo-800 mb-6 list-disc list-inside text-left mx-auto max-w-md">
            <li>Easy issue reporting with photos and location</li>
            <li>Real-time status tracking of reported issues</li>
            <li>Community voting and comments</li>
            <li>Notifications on updates and resolutions</li>
            <li>Data-driven insights for city officials</li>
          </ul>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Our Values</h2>
          <ul className="text-indigo-800 mb-6 list-disc list-inside text-left mx-auto max-w-md">
            <li>Transparency and accountability</li>
            <li>Community empowerment</li>
            <li>Collaboration with local authorities</li>
            <li>Continuous improvement</li>
          </ul>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Contact Us</h2>
          <p className="text-indigo-800 mb-6">
            Have questions, suggestions, or want to join our mission? Email us at <a href="mailto:info@cityreporter.com" className="text-indigo-600 underline hover:text-indigo-800">info@cityreporter.com</a>
          </p>
          <div className="mt-8">
            <a
              href="/report"
              className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold shadow transition"
            >
              Start Reporting an Issue
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}