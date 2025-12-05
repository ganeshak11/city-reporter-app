"use client";
import { useEffect, useState } from "react";
import { db } from "@/src/utils/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

type StatusCount = {
  Open: number;
  "In Progress": number;
  Resolved: number;
};

type Report = {
  id: string;
  category: string;
  description: string;
  imageData: string;
  position: [number, number];
  status: string;
  createdAt: any;
};

export default function ReportStatus() {
  const [statusCounts, setStatusCounts] = useState<StatusCount>({
    Open: 0,
    "In Progress": 0,
    Resolved: 0,
  });
  const [totalReports, setTotalReports] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: StatusCount = {
        Open: 0,
        "In Progress": 0,
        Resolved: 0,
      };
      
      const reportsData: Report[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const status = data.status || "Open";
        const normalizedStatus = status === "Closed" ? "Resolved" : status;
        counts[normalizedStatus as keyof StatusCount] = (counts[normalizedStatus as keyof StatusCount] || 0) + 1;
        
        reportsData.push({
          id: doc.id,
          category: data.category,
          description: data.description,
          imageData: data.imageData,
          position: data.position,
          status: normalizedStatus,
          createdAt: data.createdAt,
        });
      });
      
      setStatusCounts(counts);
      setTotalReports(snapshot.size);
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" };
      case "In Progress":
        return { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" };
      case "Resolved":
        return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" };
      case "Closed":
        return { bg: "bg-gray-50 border-gray-200", text: "text-gray-700" };
      default:
        return { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700" };
    }
  };

  const handleStatusClick = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const filteredReports = selectedStatus 
    ? reports.filter(report => report.status === selectedStatus)
    : [];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Report Status Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const colors = getStatusColor(status);
          const isSelected = selectedStatus === status;
          return (
            <div 
              key={status} 
              onClick={() => handleStatusClick(status)}
              className={`text-center p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
              } ${colors.bg}`}
            >
              <div className={`text-3xl font-bold ${colors.text}`}>{count}</div>
              <div className={`text-sm font-medium ${colors.text}`}>{status}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-indigo-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-700">{totalReports}</div>
          <div className="text-sm text-indigo-600">Total Reports</div>
        </div>
      </div>
      {selectedStatus && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">
            {selectedStatus} Issues ({filteredReports.length})
          </h3>
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-indigo-100 hover:shadow-md transition-all duration-200"
              >
                {report.imageData ? (
                  <img 
                    src={report.imageData} 
                    alt="Report" 
                    className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => window.open(report.imageData, '_blank')}
                  />
                ) : (
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-400">📷</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {report.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(report.createdAt)}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status).bg} ${getStatusColor(report.status).text}`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 