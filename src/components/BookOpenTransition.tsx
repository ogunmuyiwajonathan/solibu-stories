import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface BookOpenTransitionProps {
  isActive: boolean;
  coverUrl: string;
  onComplete: () => void;
}

export default function BookOpenTransition({ isActive, coverUrl, onComplete }: BookOpenTransitionProps) {
  const [step, setStep] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Step 1: Book Opens (0ms)
      setStep(1);

      // Generate particles
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: (Math.random() - 0.5) * window.innerHeight * 1.5,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 0.8 + 0.6,
        delay: Math.random() * 0.4,
        color: Math.random() > 0.5 ? '#FFD97D' : '#FFFFFF',
      }));
      setParticles(newParticles);

      // Step 2: Light Erupts (300ms)
      const t1 = setTimeout(() => setStep(2), 300);

      // Step 3: Particles Scatter (500ms)
      const t2 = setTimeout(() => setStep(3), 500);

      // Step 4: Screen Floods (900ms)
      const t3 = setTimeout(() => setStep(4), 900);

      // Step 5: Navigate (1400ms)
      const t4 = setTimeout(() => {
        onComplete();
      }, 1400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      setStep(0);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden"
      >
        {/* Step 4: Screen Floods With Light */}
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, #FFFDF0, #FFE8A0, #C89B5A)',
            opacity: step >= 4 ? 1 : 0,
          }}
        />

        {/* Step 2: Light Erupts */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-all duration-700"
          style={{
            opacity: step >= 2 && step < 4 ? 1 : 0,
            transform: step >= 2 ? 'scale(1)' : 'scale(0.5)',
          }}
        >
          <div className="w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw] rounded-full"
               style={{
                 background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,217,125,0.8) 20%, rgba(200,155,90,0.4) 40%, transparent 70%)',
                 transform: step >= 2 ? 'scale(8)' : 'scale(0)',
                 transition: 'transform 0.9s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s'
               }}
          />
          
          {/* God Rays */}
          {step >= 2 && Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="god-ray"
              style={{
                '--angle': `${i * 30}deg`,
              } as React.CSSProperties}
            />
          ))}

          {/* Shockwave Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[#FFD97D] rounded-full shockwave" />
        </div>

        {/* Step 3: Particles */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          {step >= 3 && particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{ 
                x: p.x, 
                y: p.y, 
                opacity: 0, 
                scale: 1 
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* Step 1: Book Opens 3D */}
        <div className="relative z-30 book-cinematic-container" style={{ perspective: '2000px' }}>
          <div className="relative w-48 h-72 sm:w-64 sm:h-96" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Back cover (stationary) */}
            <div className="absolute inset-0 bg-[#2A1F0E] rounded-md shadow-2xl" />

            {/* Left Page (Front Cover opening) */}
            <div 
              className={`absolute inset-0 book-page-left ${step >= 1 ? 'open' : ''} rounded-l-md shadow-[-10px_0_20px_rgba(0,0,0,0.5)]`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${coverUrl})`, backfaceVisibility: 'hidden' }}
              />
              <div 
                className="absolute inset-0 inner-page-glow flex flex-col gap-2 p-6 overflow-hidden"
                style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
              >
                {/* Decorative text lines */}
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="w-full h-1 bg-[#D4A853]/30 rounded-full" style={{ width: `${80 + Math.random() * 20}%` }} />
                ))}
              </div>
            </div>

            {/* Right Page */}
            <div 
              className={`absolute inset-0 book-page-right ${step >= 1 ? 'open' : ''} rounded-r-md`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className="absolute inset-0 inner-page-glow flex flex-col gap-2 p-6 overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="w-full h-1 bg-[#D4A853]/30 rounded-full" style={{ width: `${70 + Math.random() * 30}%` }} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
