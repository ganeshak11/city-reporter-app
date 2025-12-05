"use client";
import { useState } from "react";
import { db } from "@/src/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      // Add user details to Firestore
      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: serverTimestamp(),
        type: "contact"
      });

      setStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you soon."
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        type: "error",
        message: "Sorry, there was an error sending your message. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 flex flex-col items-center justify-center p-8">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-indigo-100/50"
      >
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 drop-shadow">Contact Us</h1>
        
        {/* Contact Details Section */}
        <div className="mb-8 p-6 bg-indigo-50/80 rounded-xl border border-indigo-100/50">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Contact Information</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-semibold text-indigo-900">Email</p>
                <a href="mailto:jeevankishornc@gmail.com" className="text-indigo-600 hover:text-indigo-800">jeevankishornc@gmail.com</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold text-indigo-900">Phone</p>
                <a href="tel:+919071007306" className="text-indigo-600 hover:text-indigo-800">+91 9071007306</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold text-indigo-900">Address</p>
                <p className="text-indigo-600">Guttal, Haveri District, Karnataka - 581108</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-semibold text-indigo-900">Business Hours</p>
                <p className="text-indigo-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg text-indigo-800 mb-8">
          Have questions, feedback, or want to collaborate? Reach out to the City Reporter team below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-indigo-900 font-semibold mb-1" htmlFor="name">Name</label>
            <motion.input 
              whileFocus={{ scale: 1.01 }}
              id="name" 
              type="text" 
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 bg-white/80 font-medium text-indigo-900 placeholder:text-indigo-300 shadow" 
              placeholder="Your Name" 
              required 
            />
          </div>
          <div>
            <label className="block text-indigo-900 font-semibold mb-1" htmlFor="email">Email</label>
            <motion.input 
              whileFocus={{ scale: 1.01 }}
              id="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 bg-white/80 font-medium text-indigo-900 placeholder:text-indigo-300 shadow" 
              placeholder="you@email.com" 
              required 
            />
          </div>
          <div>
            <label className="block text-indigo-900 font-semibold mb-1" htmlFor="message">Message</label>
            <motion.textarea 
              whileFocus={{ scale: 1.01 }}
              id="message" 
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 bg-white/80 font-medium text-indigo-900 placeholder:text-indigo-300 shadow" 
              placeholder="How can we help you?" 
              rows={4} 
              required 
            />
          </div>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                status.type === "success" 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-rose-100 text-rose-700 border border-rose-200"
              }`}
            >
              {status.message}
            </motion.div>
          )}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 rounded-lg shadow transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      </motion.section>
    </main>
  );
}
 