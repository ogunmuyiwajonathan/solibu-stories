import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Home, ArrowLeft, Search, Compass, BookX } from 'lucide-react';
import Navbar from '../components/Navbar';

/* ── Dust particle config ────────────────────────────────────────── */
const DUST = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + Math.round(((i * 37 + 11) % 90))}%`,
  top: `${10 + Math.round(((i * 53 + 7) % 75))}%`,
  size: 1.5 + (i % 3) * 0.5,
  dur: 3 + (i % 4),
  del: (i * 0.4) % 3,
  color:
    i % 3 === 0
      ? 'rgba(249,229,150,0.85)'
      : i % 3 === 1
      ? 'rgba(212,175,55,0.7)'
      : 'rgba(200,120,60,0.65)',
}));

/* ── Floating rune glyphs ────────────────────────────────────────── */
const RUNES = ['᚛', '᚜', 'ᚉ', 'ᚋ', 'ᚐ', 'ᚌ', 'ᚔ', 'ᚑ'];

/* ── Glitch text hook ────────────────────────────────────────────── */
function useGlitch(interval = 5000) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 350);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);
  return glitching;
}

/* ── Main 404 Page ───────────────────────────────────────────────── */
export default function NotFound() {
  const navigate = useNavigate();
  const glitching = useGlitch(4500);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  /* Subtle canvas noise in background */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 15;
      imageData.data[i] = v;
      imageData.data[i + 1] = v * 0.7;
      imageData.data[i + 2] = v * 0.4;
      imageData.data[i + 3] = 8;
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden flex flex-col">
      <Navbar />
      {/* ── Canvas noise layer ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ zIndex: 0 }}
      />

      {/* ── Deep radial bg gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(30,18,8,0.9) 0%, #0A0705 70%)',
          zIndex: 0,
        }}
      />

      {/* ── Aurora blobs ── */}
      {[
        { top: '10%', left: '5%',  w: '45%', h: '55%', color: 'rgba(212,175,55,0.07)' },
        { top: '30%', right: '0',  w: '40%', h: '60%', color: 'rgba(170,80,30,0.06)' },
        { bottom: '5%', left: '25%', w: '50%', h: '40%', color: 'rgba(80,50,180,0.04)' },
      ].map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ ...blob, background: `radial-gradient(ellipse at center, ${blob.color} 0%, transparent 70%)`, filter: 'blur(80px)', zIndex: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.5, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Golden grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          zIndex: 0,
        }}
      />

      {/* ── Floating dust particles ── */}
      {DUST.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: `0 0 ${d.size * 4}px ${d.size}px ${d.color}`,
            zIndex: 1,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, 8, -4, 0],
            opacity: [0, 0.8, 0.4, 0.9, 0],
            scale: [0.8, 1.3, 0.9, 1.2, 0.8],
          }}
          transition={{
            duration: d.dur,
            repeat: Infinity,
            delay: d.del,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Floating rune glyphs ── */}
      {RUNES.map((rune, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none font-display"
          style={{
            left: `${8 + (i * 12) % 84}%`,
            top: `${15 + (i * 17) % 65}%`,
            fontSize: 14 + (i % 3) * 4,
            color: `rgba(212,175,55,${0.06 + (i % 4) * 0.03})`,
            zIndex: 1,
          }}
          animate={{
            y: [0, -12, 6, 0],
            opacity: [0.04, 0.12, 0.05, 0.04],
            rotate: [0, 5, -3, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
        >
          {rune}
        </motion.span>
      ))}

      {/* ── Golden hairline top/bottom ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 40%, rgba(249,229,150,0.6) 50%, rgba(212,175,55,0.4) 60%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 pt-16 pb-8 text-center h-full">

        {/* 404 glitch number */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative mb-4"
        >
          <motion.h1
            className={`font-display font-bold tracking-tighter leading-none select-none glitch-text ${glitching ? 'glitch-book glitching' : 'glitch-book'}`}
            style={{
              fontSize: 'clamp(5rem, 20vw, 10rem)',
              background: 'linear-gradient(135deg, #F9E596 0%, #D4AF37 40%, #AA7E2D 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.4))',
            }}
          >
            404
          </motion.h1>

          {/* Glitch ghost layers */}
          <AnimatePresence>
            {glitching && (
              <>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 font-display font-bold tracking-tighter leading-none pointer-events-none"
                  style={{
                    fontSize: 'clamp(5rem, 20vw, 10rem)',
                    color: 'rgba(212,175,55,0.35)',
                    transform: 'translate(-4px, 1px)',
                    clipPath: 'inset(20% 0 60% 0)',
                  }}
                >
                  404
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: 0.08 }}
                  className="absolute inset-0 font-display font-bold tracking-tighter leading-none pointer-events-none"
                  style={{
                    fontSize: 'clamp(5rem, 20vw, 10rem)',
                    color: 'rgba(255,255,255,0.2)',
                    transform: 'translate(4px, -1px)',
                    clipPath: 'inset(55% 0 20% 0)',
                  }}
                >
                  404
                </motion.span>
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="font-display text-3xl sm:text-4xl font-medium tracking-tight mb-4"
          style={{ color: 'var(--text-strong)' }}
        >
          The Lost Chapter
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-10"
          style={{ color: 'var(--text-muted)' }}
        >
          The page you seek has vanished into the void — like a chapter torn from an ancient manuscript. Perhaps it was moved, deleted, or never existed at all.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="w-full max-w-sm mb-10"
        >
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.form
                key="search"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSearch}
                className="flex items-center gap-2 p-1 rounded-full"
                style={{
                  background: 'rgba(36,26,18,0.7)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.1)',
                }}
              >
                <Search className="w-4 h-4 ml-3 flex-shrink-0" style={{ color: 'rgba(212,175,55,0.6)' }} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a story..."
                  className="flex-1 bg-transparent outline-none text-sm py-2 px-1"
                  style={{ color: 'var(--text-soft)', caretColor: 'var(--gold)' }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-deep))',
                    color: '#000',
                    fontSize: '0.75rem',
                  }}
                >
                  Go
                </button>
              </motion.form>
            ) : (
              <motion.button
                key="trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm transition-all"
                style={{
                  background: 'rgba(36,26,18,0.5)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: 'rgba(212,175,55,0.7)',
                  backdropFilter: 'blur(8px)',
                }}
                whileHover={{ borderColor: 'rgba(212,175,55,0.55)', background: 'rgba(36,26,18,0.7)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className="w-4 h-4" />
                Search for a story instead…
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link to="/" className="btn-primary btn-shimmer flex items-center gap-2 px-7 py-3">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link to="/library" className="btn-ghost flex items-center gap-2 px-7 py-3">
            <BookOpen className="w-4 h-4" />
            Browse Library
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm transition-all px-4 py-3"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div
            style={{
              height: 1,
              width: 280,
              background:
                'linear-gradient(90deg, transparent, rgba(212,175,55,0.35) 30%, rgba(249,229,150,0.55) 50%, rgba(212,175,55,0.35) 70%, transparent)',
            }}
          />
          <div className="flex items-center gap-3">
            <BookX className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.4)' }} />
            <p className="text-xs" style={{ color: 'rgba(200,155,90,0.45)', letterSpacing: '0.15em' }}>
              SOLIBU STORIES · PAGE NOT FOUND
            </p>
            <Compass className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.4)' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
