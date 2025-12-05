"use client";
import { useEffect, useState } from "react";
import { db } from "@/src/utils/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, updateDoc, doc, increment } from "firebase/firestore";
import { FaClock, FaMapMarkerAlt, FaThumbsUp, FaComment, FaRoad, FaLightbulb, FaTrash, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type Report = {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
  position: [number, number];
  status: string;
  createdAt: any;
  upvotes?: number;
  comments?: number;
};

const categoryIcons = {
  "Pothole": { icon: FaRoad, color: "bg-indigo-500" },
  "Lighting": { icon: FaLightbulb, color: "bg-amber-500" },
  "Sanitation": { icon: FaTrash, color: "bg-emerald-500" },
  "Other": { icon: FaExclamationCircle, color: "bg-gray-500" }
};

export default function DashboardStats() {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [totalUpvotes, setTotalUpvotes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const [upvotedReports, setUpvotedReports] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Get recent reports
    const recentQuery = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    // Get all reports for category distribution
    const allReportsQuery = query(collection(db, "reports"));

    const unsubscribeRecent = onSnapshot(recentQuery, (snapshot) => {
      const reports: Report[] = [];
      let upvotes = 0;
      let comments = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const report = {
          id: doc.id,
          category: data.category,
          description: data.description,
          imageUrl: data.imageUrl,
          position: data.position,
          status: data.status,
          createdAt: data.createdAt,
          upvotes: data.upvotes || 0,
          comments: data.comments || 0,
        };
        reports.push(report);
        
        // Sum upvotes and comments
        upvotes += data.upvotes || 0;
        comments += data.comments || 0;
      });

      setRecentReports(reports);
      setTotalUpvotes(upvotes);
      setTotalComments(comments);
    });

    const unsubscribeAll = onSnapshot(allReportsQuery, (snapshot) => {
      const categories: Record<string, number> = {
        "Pothole": 0,
        "Lighting": 0,
        "Sanitation": 0,
        "Other": 0
      };

      snapshot.forEach((doc) => {
        const data = doc.data();
        const category = data.category || "Other";
        categories[category] = (categories[category] || 0) + 1;
      });

      setCategoryStats(categories);
      setTotalReports(snapshot.size);
    });

    return () => {
      unsubscribeRecent();
      unsubscribeAll();
    };
  }, []);

  const handleUpvote = async (reportId: string) => {
    if (upvotedReports.has(reportId)) return;
    
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        upvotes: increment(1)
      });
      setUpvotedReports(prev => new Set([...prev, reportId]));
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleComment = async (reportId: string) => {
    if (!comment.trim()) return;
    
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        comments: increment(1)
      });
      setComment("");
      setShowCommentModal(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons]?.icon || FaExclamationTriangle;
    return <Icon className="text-lg" />;
  };

  const getCategoryColor = (category: string) => {
    return categoryIcons[category as keyof typeof categoryIcons]?.color || "bg-gray-500";
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100/50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <FaClock className="text-indigo-600" />
          </motion.div>
          Recent Activity
        </h2>
        <div className="space-y-5">
          <AnimatePresence>
            {recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-br from-indigo-50/80 to-white rounded-xl p-5 border border-indigo-100/50 hover:shadow-md hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-indigo-900 text-lg">{report.category}</h3>
                  <motion.span 
                    className="text-sm text-indigo-600/80 font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    {formatDate(report.createdAt)}
                  </motion.span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{report.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpvote(report.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      upvotedReports.has(report.id)
                        ? 'bg-indigo-100 text-indigo-700 shadow-inner'
                        : 'text-indigo-600 hover:bg-indigo-50 hover:shadow-sm'
                    }`}
                    disabled={upvotedReports.has(report.id)}
                  >
                    <FaThumbsUp className="text-lg" /> 
                    <span className="font-medium">{report.upvotes || 0}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedReport(report);
                      setShowCommentModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-indigo-600 hover:bg-indigo-50 hover:shadow-sm transition-all duration-300"
                  >
                    <FaComment className="text-lg" /> 
                    <span className="font-medium">{report.comments || 0}</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="space-y-8">
        {/* Category Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100/50 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaMapMarkerAlt className="text-indigo-600" />
            </motion.div>
            Category Distribution
          </h2>
          <div className="space-y-6">
            {Object.entries(categoryIcons).map(([category, { icon: Icon, color }], index) => {
              const count = categoryStats[category] || 0;
              const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`${color} text-white p-2 rounded-xl shadow-sm`}
                      >
                        <Icon className="text-lg" />
                      </motion.div>
                      <span className="text-gray-800 font-medium">{category}</span>
                    </div>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="font-semibold text-indigo-900"
                    >
                      {count}
                    </motion.span>
                  </div>
                  <div className="h-3 bg-indigo-50/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full ${color}`}
                    />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-sm text-indigo-600/80 text-right font-medium"
                  >
                    {percentage.toFixed(1)}% of total reports
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Engagement Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100/50 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Community Engagement</h2>
          <div className="grid grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-50/80 to-white rounded-xl p-6 text-center border border-indigo-100/50 hover:shadow-md transition-all duration-300"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                className="text-3xl font-bold text-indigo-900 mb-2"
              >
                {totalUpvotes}
              </motion.div>
              <div className="text-sm text-indigo-600/80 font-medium">Total Upvotes</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-50/80 to-white rounded-xl p-6 text-center border border-indigo-100/50 hover:shadow-md transition-all duration-300"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                className="text-3xl font-bold text-indigo-900 mb-2"
              >
                {totalComments}
              </motion.div>
              <div className="text-sm text-indigo-600/80 font-medium">Total Comments</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && selectedReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 border border-indigo-100/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-indigo-900">Add Comment</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowCommentModal(false);
                    setSelectedReport(null);
                    setComment("");
                  }}
                  className="text-gray-500 hover:text-indigo-700 text-2xl transition-colors duration-300"
                >
                  ×
                </motion.button>
              </div>
              <div className="mb-6">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-indigo-50/80 rounded-xl p-4 mb-4 border border-indigo-100/50"
                >
                  <p className="text-indigo-900 text-sm leading-relaxed">{selectedReport.description}</p>
                </motion.div>
                <motion.textarea
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full border border-indigo-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-indigo-900 placeholder-indigo-300/70 bg-white resize-none"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCommentModal(false);
                    setSelectedReport(null);
                    setComment("");
                  }}
                  className="px-6 py-2.5 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleComment(selectedReport.id)}
                  disabled={!comment.trim()}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300 hover:shadow-md"
                >
                  Submit Comment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 