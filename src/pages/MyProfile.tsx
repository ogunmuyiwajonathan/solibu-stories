import { motion } from 'framer-motion';
import { UserProfile } from '@clerk/react';

export default function MyProfile() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <UserProfile routing="hash" />
      </motion.div>
    </div>
  );
}
