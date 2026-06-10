import { motion } from 'framer-motion';

interface SkeletonCardProps {
  count?: number;
  isDark?: boolean;
}

export default function SkeletonCard({ count = 4, isDark = false }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={`rounded-xl overflow-hidden animate-pulse ${
            isDark ? 'bg-[#1D140D] border border-[#4C3C2F]/40' : 'bg-[#F8EEE2] border border-[#E4D7C5]'
          }`}
        >
          <div className={`aspect-[2/3] ${isDark ? 'bg-[#2F231B]' : 'bg-[#E4D7C5]'}`} />
          <div className="p-4 space-y-3">
            <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-[#2F231B]' : 'bg-[#E4D7C5]'}`} />
            <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-[#2F231B]' : 'bg-[#E4D7C5]'}`} />
            <div className={`border-t pt-3 flex justify-between ${isDark ? 'border-[#4C3C2F]/40' : 'border-[#E4D7C5]'}`}>
              <div className={`h-3 rounded w-16 ${isDark ? 'bg-[#2F231B]' : 'bg-[#E4D7C5]'}`} />
              <div className={`h-3 rounded w-10 ${isDark ? 'bg-[#2F231B]' : 'bg-[#E4D7C5]'}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}

