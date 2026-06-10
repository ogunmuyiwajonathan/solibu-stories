import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#101838] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <BookOpen className="w-16 h-16 text-[#1EAE98] mx-auto mb-6" />
        <h1 className="font-display text-6xl md:text-8xl font-medium text-white tracking-tight">
          404
        </h1>
        <p className="mt-4 text-[#637381] text-lg max-w-md mx-auto">
          Looks like this page has been lost in the chapters. Let's get you back to the story.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 btn-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
