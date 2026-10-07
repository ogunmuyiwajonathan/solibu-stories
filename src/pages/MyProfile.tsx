import { motion } from 'framer-motion';
import { UserProfile } from '@clerk/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function MyProfile() {
  useDocumentMeta('My Profile',
    'Your Solibu Stories reading profile.');
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-[var(--color-bg)] py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <UserProfile routing="hash" />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
