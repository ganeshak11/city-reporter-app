"use client";
import { useEffect, useState } from "react";
import { db } from "@/src/utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function IssueCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      setCount(snapshot.size);
    });
    return () => unsub();
  }, []);

  return (
    <div className="inline-block bg-gradient-to-r from-blue-100 via-cream-100 to-white border border-blue-200 rounded-xl px-6 py-4 shadow text-center">
      <div className="text-3xl font-extrabold text-blue-700 mb-1">{count !== null ? count : "-"}</div>
      <div className="text-blue-800 font-semibold text-sm tracking-wide">Total Issues Reported</div>
    </div>
  );
} 