"use client";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";
import { db } from "@/src/utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const defaultPosition: [number, number] = [12.30871, 76.65308];

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full rounded-lg shadow-inner bg-gray-100 flex items-center justify-center">
        <div className="text-indigo-600">Loading map...</div>
      </div>
    ),
  }
);

type Report = {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
  position: [number, number];
  status: string;
};

export default function MapView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('MapView: received new snapshot from Firestore');
      const data: Report[] = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          category: d.category,
          description: d.description,
          imageUrl: d.imageUrl,
          position: d.position,
          status: d.status || "Reported",
        };
      }).filter(r => Array.isArray(r.position) && r.position.length === 2);
      setReports(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (typeof window === 'undefined') {
    return (
      <div className="h-96 w-full rounded-lg shadow-inner bg-gray-100 flex items-center justify-center">
        <div className="text-indigo-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-50 to-white p-2 rounded-xl shadow-md border border-indigo-100">
        <MapWithNoSSR reports={reports} defaultPosition={defaultPosition} />
        {loading && <div className="text-center text-indigo-600 mt-2">Loading reports...</div>}
        {!loading && reports.length === 0 && <div className="text-center text-gray-500 mt-2">No reports found.</div>}
      </div>
    </div>
  );
}
