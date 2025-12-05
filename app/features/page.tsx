"use client";
import { FaMapMarkerAlt, FaCamera, FaChartBar, FaUserShield, FaBell, FaSearch, FaMobileAlt, FaComments, FaHistory, FaCheckCircle } from 'react-icons/fa';

export default function FeaturesPage() {
  const features = [
    {
      title: "Issue Reporting",
      description: "Submit detailed reports with photos, descriptions, and precise location mapping. Support for multiple categories including potholes, lighting, and sanitation issues.",
      icon: <FaCamera className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-indigo-50"
    },
    {
      title: "Interactive Map",
      description: "View all reported issues on a real-time interactive map. Click markers to see details, photos, and current status of each issue.",
      icon: <FaMapMarkerAlt className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-indigo-50/80",
      style: { background: 'rgba(238, 242, 255, 0.8)' }
    },
    {
      title: "Status Tracking",
      description: "Monitor the progress of reported issues with real-time status updates. Track issues from 'Open' to 'In Progress', 'Resolved', and 'Closed'.",
      icon: <FaCheckCircle className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-white/80"
    },
    {
      title: "Dashboard Analytics",
      description: "View comprehensive statistics and analytics about reported issues. Filter by status, category, and time period.",
      icon: <FaChartBar className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-indigo-50/80"
    },
    {
      title: "User Authentication",
      description: "Secure login system with email and Google authentication. Personalized user profiles and report history.",
      icon: <FaUserShield className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-white/80"
    },
    {
      title: "Real-time Updates",
      description: "Receive instant notifications about status changes and updates on your reported issues.",
      icon: <FaBell className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-indigo-50/80",
      style: { background: 'rgba(238, 242, 255, 0.8)' }
    },
    {
      title: "Advanced Search",
      description: "Search and filter issues by category, status, location, and date. Find specific issues quickly and efficiently.",
      icon: <FaSearch className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-white/80"
    },
    {
      title: "Mobile Responsive",
      description: "Fully responsive design that works seamlessly on all devices - from mobile phones to desktop computers.",
      icon: <FaMobileAlt className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-indigo-50/80"
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive admin tools for managing issues, updating statuses, and communicating with users.",
      icon: <FaComments className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-white/80"
    },
    {
      title: "Issue History",
      description: "Access complete history of all reported issues with detailed timestamps and status changes.",
      icon: <FaHistory className="text-3xl text-indigo-600 mb-4" />,
      color: "bg-indigo-50/80",
      style: { background: 'rgba(238, 242, 255, 0.8)' }
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 flex flex-col items-center p-8">
      <section className="max-w-6xl w-full text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-indigo-100/50">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 drop-shadow">Platform Features</h1>
        <p className="text-lg text-indigo-800 mb-8 max-w-3xl mx-auto">
          City Reporter offers a comprehensive suite of tools to empower citizens and city officials in making our cities better places to live.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-left">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.color} rounded-xl shadow p-6 border border-indigo-100/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}
              style={feature.style}
            >
              <div className="flex flex-col items-center text-center mb-4">
                {feature.icon}
                <h2 className="text-xl font-bold text-indigo-900 mb-2">{feature.title}</h2>
              </div>
              <p className="text-indigo-800">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 bg-indigo-50/80 rounded-xl border border-indigo-100/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Why Choose City Reporter?</h2>
          <p className="text-indigo-800 mb-4">
            Our platform combines powerful features with an intuitive interface, making it easy for citizens to report issues and for city officials to manage them effectively. With real-time updates, comprehensive tracking, and mobile accessibility, we're making city management more efficient and transparent.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <a href="/report" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition">
              Start Reporting
            </a>
            <a href="/dashboard" className="bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-6 py-3 rounded-lg border border-indigo-200 transition shadow">
              View Dashboard
            </a>
          </div>
        </div>
      </section>
    </main>
  );
} 