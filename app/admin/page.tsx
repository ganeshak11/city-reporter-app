"use client";
import { useEffect, useState } from "react";
import { db } from "@/src/utils/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import MapView from "@/src/components/MapView";
import IssueCount from "@/src/components/IssueCount";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved"];

export default function AdminPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "reports"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    setUpdating(reportId);
    await updateDoc(doc(db, "reports", reportId), { status: newStatus });
    setReports(reports => reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    setUpdating(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Admin Panel</h1>
      <p className="text-gray-600 mb-8">Manage all reported issues below.</p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mb-8 items-start justify-between">
        <IssueCount />
        <div className="flex-1 min-w-[300px]">
          <MapView />
        </div>
      </div>
      {loading ? (
        <div>Loading reports...</div>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white rounded-xl shadow border border-indigo-100">
            <thead>
              <tr className="bg-indigo-50">
                <th className="py-2 px-4 text-left text-black">Category</th>
                <th className="py-2 px-4 text-left text-black">Description</th>
                <th className="py-2 px-4 text-left text-black">Status</th>
                <th className="py-2 px-4 text-left text-black">Location</th>
                <th className="py-2 px-4 text-left text-black">Image</th>
                <th className="py-2 px-4 text-left text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} className="border-t">
                  <td className="py-2 px-4 text-black">{report.category}</td>
                  <td className="py-2 px-4 max-w-xs truncate text-black" title={report.description}>{report.description}</td>
                  <td className="py-2 px-4 text-black">
                    <span className={
                      report.status === "Open"
                        ? "bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                        : report.status === "In Progress"
                        ? "bg-blue-200 text-blue-800 px-2 py-1 rounded"
                        : "bg-green-200 text-green-800 px-2 py-1 rounded"
                    }>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-xs text-black">
                    {report.position ? `${report.position[0].toFixed(4)}, ${report.position[1].toFixed(4)}` : "-"}
                  </td>
                  <td className="py-2 px-4 text-black">
                    {report.imageData ? (
                      <img 
                        src={report.imageData} 
                        alt="Report" 
                        className="h-12 w-12 object-cover rounded cursor-pointer hover:scale-150 transition-transform duration-200" 
                        onClick={() => window.open(report.imageData, '_blank')}
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-black">
                    <select
                      value={report.status}
                      onChange={e => handleStatusChange(report.id, e.target.value)}
                      disabled={updating === report.id}
                      className="border rounded px-2 py-1"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
} 