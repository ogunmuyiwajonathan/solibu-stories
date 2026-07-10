import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SignIn } from '@clerk/react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Mobile: full-screen background image */}
      <div className="lg:hidden fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[#1a120a] to-[var(--surface-strong)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-[var(--color-bg)]/80" />
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Desktop left panel - sticky, fits viewport */}
        <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[#1a120a] to-[var(--surface-strong)]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center max-w-md"
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20">
                  <img src="/images/logo.webp" alt="Solibu Stories" className="w-8 h-8 object-contain" />
                </div>
                <span className="font-display text-3xl font-semibold text-[var(--text-strong)] tracking-tight">
                  Solibu Stories
                </span>
              </div>
              <h2 className="font-display text-4xl font-medium text-[var(--text-strong)] leading-tight mb-4">
                Your next great adventure awaits
              </h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                 Discover thousands of captivating stories. Sign in to track your reading journey and build your personal library.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right panel - scrollable */}
        <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex items-start justify-center py-8 px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden flex items-center gap-2.5 mb-10">
              <div className="p-2 rounded-xl bg-[var(--gold)]/10">
                <img src="/images/logo.webp" alt="Solibu Stories" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-display text-2xl font-semibold text-[var(--text-strong)] tracking-tight">
                Solibu Stories
              </span>
            </div>

            <SignIn routing="hash" signUpUrl="/signup" />

            <div className="mt-8 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-soft)] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

