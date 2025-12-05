"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { db, storage } from "@/src/utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-lg shadow-inner bg-gray-100 flex items-center justify-center">
        <div className="text-blue-600">Loading map...</div>
      </div>
    ),
  }
);

// Validation regex for description
const DESCRIPTION_REGEX = /^[a-zA-Z0-9\s.,!?-]+$/;

// Image compression options
const compressionOptions = {
  maxSizeMB: 0.3,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
  initialQuality: 0.8,
};

const defaultPosition: [number, number] = [12.9716, 77.5946]; // Example: Mysore

export default function ReportForm() {
  const [category, setCategory] = useState("Pothole");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'compressing' | 'processing'>('idle');
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    if (!useManualLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setPosition([position.coords.latitude, position.coords.longitude]);
            setLocationError(null);
          },
          (error) => {
            setLocationError("Unable to get location. Please select manually on map.");
            setUseManualLocation(true);
          },
          { timeout: 10000, enableHighAccuracy: false }
        );
      } else {
        setLocationError("Geolocation not supported. Please select manually.");
        setUseManualLocation(true);
      }
    }
  }, [useManualLocation]);

  const validateDescription = (text: string): boolean => {
    const trimmedText = text.trim();
    
    if (trimmedText.length < 10) {
      setDescriptionError("Description must be at least 10 characters long");
      return false;
    }
    
    if (trimmedText.length > 500) {
      setDescriptionError("Description cannot exceed 500 characters");
      return false;
    }
    
    if (!DESCRIPTION_REGEX.test(trimmedText)) {
      setDescriptionError("Description can only contain letters, numbers, and basic punctuation (.,!?-)");
      return false;
    }
    
    setDescriptionError(null);
    return true;
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    validateDescription(newValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      if (f.size > 5 * 1024 * 1024) { // 5MB limit
        setStatus({
          type: "error",
          message: "File size must be less than 5MB"
        });
        return;
      }
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDescription(description)) {
      return;
    }
    
    if (!position || !description) {
      setStatus({
        type: "error",
        message: "Please fill all fields and ensure location is selected."
      });
      return;
    }
    
    setSubmitting(true);
    setProgress(0);
    setUploadPhase('idle');
    setStatus({ type: null, message: "" });

    try {
      let imageData = "";
      if (file) {
        try {
          console.log("Starting image compression...");
          setUploadPhase('compressing');
          
          // Validate file type
          if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
          }
          
          const compressedFile = await imageCompression(file, compressionOptions);
          console.log("Image compressed successfully:", compressedFile.size, "bytes");
          
          if (compressedFile.size === 0) {
            throw new Error('Compressed file is empty');
          }
          
          setUploadPhase('processing');
          // Convert compressed file to base64
          const reader = new FileReader();
          imageData = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(compressedFile);
          });
          
          console.log("Image converted to base64");
          
        } catch (error) {
          console.error("Image processing error details:", error);
          setStatus({
            type: "error",
            message: error instanceof Error 
              ? `Image processing failed: ${error.message}`
              : "Failed to process image. Please try again with a different image."
          });
          setSubmitting(false);
          return;
        }
      }

      console.log("Preparing to save report data...");
      const reportData = {
        category,
        description: description.trim(),
        imageData, // Store base64 string instead of URL
        position,
        createdAt: serverTimestamp(),
        status: "Open",
      };

      console.log("Saving report to Firestore...");
      await addDoc(collection(db, "reports"), reportData);
      console.log("Report saved successfully");
      
      setStatus({
        type: "success",
        message: "Report submitted successfully! Thank you for helping improve our city."
      });
      
      // Reset form
      setCategory("Pothole");
      setDescription("");
      setDescriptionError(null);
      setFile(null);
      setFilePreview(null);
      setProgress(0);
      setUploadPhase('idle');
    } catch (err) {
      console.error("Final submission error:", err);
      setStatus({
        type: "error",
        message: err instanceof Error 
          ? `Submission failed: ${err.message}`
          : "Error submitting report. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getUploadStatus = () => {
    if (!submitting) return null;
    
    if (uploadPhase === 'compressing') {
      return "Compressing image...";
    }
    
    if (uploadPhase === 'processing') {
      return "Processing image...";
    }
    
    return "Submitting report...";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-indigo-100/50 max-w-xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
        <span className="inline-block text-2xl">📝</span> Submit a New Report
      </h2>

      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg ${
              status.type === "success" 
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                : "bg-rose-100 text-rose-700 border border-rose-200"
            }`}
          >
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category</label>
        <select 
          id="category" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition text-gray-700 bg-white/80"
        >
          <option value="Pothole">Pothole</option>
          <option value="Lighting">Lighting</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Other">Others</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
          Description
          <span className="text-xs text-gray-500 ml-1">(10-500 characters)</span>
        </label>
        <textarea 
          id="description" 
          value={description} 
          onChange={handleDescriptionChange}
          className={`w-full border ${descriptionError ? 'border-rose-300' : 'border-gray-200'} p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition text-gray-700 bg-white/80`}
          placeholder="Describe the issue in detail..."
          rows={3} 
          required 
        />
        {descriptionError && (
          <p className="text-rose-500 text-sm mt-1">{descriptionError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {description.length}/500 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="file">
          Upload Photo
          <span className="text-xs text-gray-500 ml-1">(max 5MB)</span>
        </label>
        <div className="flex items-center gap-3">
          <label 
            htmlFor="file" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow cursor-pointer transition-colors duration-200"
          >
            {file ? "Change Photo" : "Choose Photo"}
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={submitting}
          />
          {file && (
            <span className="text-indigo-700 text-sm truncate max-w-xs">
              {file.name}
            </span>
          )}
        </div>
        {filePreview && (
          <img 
            src={filePreview} 
            alt="Preview" 
            className="mt-2 rounded-lg max-h-40 border border-gray-200" 
          />
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="manualLocation"
            checked={useManualLocation}
            onChange={(e) => setUseManualLocation(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={submitting}
          />
          <label htmlFor="manualLocation" className="text-sm font-medium text-gray-700">
            Select location manually on map
          </label>
        </div>
        
        {useManualLocation ? (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <MapWithNoSSR 
              reports={[]} 
              defaultPosition={position || defaultPosition}
              onPositionSelect={setPosition}
              isSelectionMode={true}
            />
          </div>
        ) : (
          <div>
            {locationError ? (
              <p className="text-rose-500 text-sm">{locationError}</p>
            ) : position ? (
              <p className="text-emerald-600 text-sm">Location obtained: {position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
            ) : (
              <p className="text-indigo-600 text-sm">Getting your location...</p>
            )}
          </div>
        )}
        {position && (
          <p className="text-xs text-indigo-600 mt-1">
            Selected coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
        )}
      </div>

      <div className="relative">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={submitting || !position || !!descriptionError} 
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="inline-block text-lg">🚀</span> {submitting ? getUploadStatus() : "Submit Report"}
        </motion.button>
        {submitting && (
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-indigo-100 rounded-b-lg overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
            />
          </div>
        )}
      </div>
    </form>
  );
}
