import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleScene from '../components/ParticleScene';
import BookCard from '../components/BookCard';
// import StatsBar from '../components/StatsBar';
import { fetchBooks, getFeaturedBooks, type Book } from '../data/books';

export default function Home() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    async function loadHomeData() {
      const books = await fetchBooks();
      setAllBooks(books);
      const featured = getFeaturedBooks(books);
      setFeaturedBooks(featured);
    }
    loadHomeData();
  }, []);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, featuredBooks.length - 2));
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.max(1, featuredBooks.length - 2)) % Math.max(1, featuredBooks.length - 2));
  };

  return (
    <div className="min-h-screen text-[var(--color-text)]">
      <Navbar />

      <section className="relative min-h-screen bg-[var(--landing-bg)] text-[var(--landing-text)] flex items-center justify-center overflow-hidden">
        <ParticleScene />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-[0.3em] uppercase mb-6">
              Welcome to Solibu Stories
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-[var(--color-text)] tracking-tight leading-[1.05] max-w-4xl mx-auto"
          >
            Read your favorite
            <br />
            <span className="animate-shimmer">novels with joy.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-[var(--color-muted)] text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
          >
            Explore a curated library of captivating stories. Read online, track your
            progress, and discover your next adventure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/library" className="btn-primary btn-shimmer">
              Explore Library
            </Link>
            <Link to="/about" className="btn-ghost">
              About Us
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5 text-[var(--color-muted)]" />
          </motion.div>
        </motion.div>
      </section>

      <section className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(180deg, #07040200 0%, #0d0804 8%, #100905 30%, #150c07 50%, #100905 72%, #0d0804 92%, #07040200 100%)' }}>

        {/* ── Layer 1: Deep dark radial base ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #1c1005 0%, #0a0603 60%, transparent 100%)' }} />

        {/* ── Layer 2: Aurora bloom glows ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Amber primary bloom – left */}
          <div className="absolute" style={{ top: '15%', left: '-5%', width: '55%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.10) 0%, rgba(170,126,45,0.05) 40%, transparent 70%)', filter: 'blur(60px)' }} />
          {/* Copper secondary bloom – right */}
          <div className="absolute" style={{ top: '10%', right: '-8%', width: '50%', height: '75%', background: 'radial-gradient(ellipse at center, rgba(200,120,60,0.08) 0%, rgba(160,90,30,0.04) 45%, transparent 72%)', filter: 'blur(80px)' }} />
          {/* Crimson ember accent – bottom center */}
          <div className="absolute" style={{ bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(180,60,30,0.06) 0%, rgba(120,40,20,0.03) 50%, transparent 75%)', filter: 'blur(100px)' }} />
          {/* Cold indigo counter-light – top */}
          <div className="absolute" style={{ top: '-8%', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '40%', background: 'radial-gradient(ellipse at center, rgba(80,60,160,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        {/* ── Layer 3: Subtle grid texture ── */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.6) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        {/* ── Layer 4: Vignette border ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px 40px rgba(4,2,1,0.85)' }} />

        {/* ── Layer 5: Golden hairline separators ── */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.0) 10%, rgba(212,175,55,0.35) 40%, rgba(249,229,150,0.55) 50%, rgba(212,175,55,0.35) 60%, rgba(212,175,55,0.0) 90%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.0) 10%, rgba(212,175,55,0.35) 40%, rgba(249,229,150,0.55) 50%, rgba(212,175,55,0.35) 60%, rgba(212,175,55,0.0) 90%, transparent 100%)' }} />

        {/* ── Layer 6: Rich multi-tier particle system ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          {/* Tier A – Micro sparkles (1px, fast twinkle, 25 particles) */}
          {[
            { l:'3%',  t:'12%', dur:2.1, del:0.0 }, { l:'9%',  t:'44%', dur:1.8, del:0.4 },
            { l:'14%', t:'71%', dur:2.5, del:1.1 }, { l:'19%', t:'28%', dur:1.6, del:0.7 },
            { l:'24%', t:'88%', dur:2.3, del:1.8 }, { l:'31%', t:'17%', dur:1.9, del:0.2 },
            { l:'37%', t:'63%', dur:2.7, del:0.9 }, { l:'42%', t:'42%', dur:1.5, del:1.5 },
            { l:'47%', t:'79%', dur:2.2, del:0.3 }, { l:'53%', t:'8%',  dur:1.7, del:2.1 },
            { l:'58%', t:'55%', dur:2.9, del:0.6 }, { l:'63%', t:'33%', dur:1.4, del:1.3 },
            { l:'69%', t:'91%', dur:2.0, del:0.8 }, { l:'74%', t:'22%', dur:2.4, del:0.1 },
            { l:'79%', t:'67%', dur:1.6, del:1.7 }, { l:'84%', t:'48%', dur:2.8, del:0.5 },
            { l:'89%', t:'14%', dur:1.9, del:2.3 }, { l:'93%', t:'76%', dur:2.1, del:1.0 },
            { l:'7%',  t:'57%', dur:1.7, del:1.4 }, { l:'27%', t:'94%', dur:2.6, del:0.2 },
            { l:'49%', t:'30%', dur:1.5, del:2.0 }, { l:'66%', t:'82%', dur:2.3, del:0.7 },
            { l:'82%', t:'6%',  dur:1.8, del:1.6 }, { l:'96%', t:'39%', dur:2.5, del:0.3 },
            { l:'41%', t:'95%', dur:2.0, del:1.2 },
          ].map((p, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute rounded-full"
              style={{ width: 1.5, height: 1.5, left: p.l, top: p.t,
                background: i % 4 === 0 ? 'rgba(249,229,150,0.9)' : i % 4 === 1 ? 'rgba(212,175,55,0.8)' : i % 4 === 2 ? 'rgba(255,245,200,1)' : 'rgba(200,155,80,0.7)',
                boxShadow: '0 0 4px 1px rgba(212,175,55,0.5)',
              }}
              animate={{ opacity: [0, 1, 0.2, 0.8, 0], scale: [0.5, 1.4, 0.8, 1.2, 0.5] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
            />
          ))}

          {/* Tier B – Glowing orbs (3–5px, drift up, soft glow, 20 particles) */}
          {[
            { w:3, l:'6%',  t:'25%', dur:6,  del:0.0, op:0.55 }, { w:4, l:'12%', t:'70%', dur:8,  del:1.3, op:0.40 },
            { w:3, l:'21%', t:'45%', dur:7,  del:0.6, op:0.50 }, { w:5, l:'29%', t:'15%', dur:9,  del:2.1, op:0.30 },
            { w:3, l:'36%', t:'82%', dur:6,  del:0.9, op:0.45 }, { w:4, l:'44%', t:'38%', dur:8,  del:1.7, op:0.35 },
            { w:3, l:'52%', t:'60%', dur:7,  del:0.3, op:0.50 }, { w:5, l:'60%', t:'20%', dur:10, del:2.5, op:0.25 },
            { w:3, l:'67%', t:'75%', dur:6,  del:1.1, op:0.45 }, { w:4, l:'75%', t:'10%', dur:8,  del:0.5, op:0.40 },
            { w:3, l:'83%', t:'50%', dur:7,  del:1.8, op:0.35 }, { w:5, l:'91%', t:'30%', dur:9,  del:0.2, op:0.28 },
            { w:4, l:'16%', t:'90%', dur:6,  del:2.0, op:0.42 }, { w:3, l:'34%', t:'5%',  dur:8,  del:0.8, op:0.38 },
            { w:5, l:'57%', t:'85%', dur:11, del:3.0, op:0.20 }, { w:3, l:'71%', t:'55%', dur:7,  del:1.4, op:0.44 },
            { w:4, l:'87%', t:'88%', dur:6,  del:0.6, op:0.36 }, { w:3, l:'4%',  t:'50%', dur:9,  del:1.9, op:0.32 },
            { w:4, l:'48%', t:'95%', dur:7,  del:2.4, op:0.28 }, { w:3, l:'95%', t:'65%', dur:8,  del:0.7, op:0.40 },
          ].map((p, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full"
              style={{ width: p.w, height: p.w, left: p.l, top: p.t,
                background: i % 3 === 0 ? `rgba(212,175,55,${p.op})` : i % 3 === 1 ? `rgba(249,229,150,${p.op * 0.85})` : `rgba(200,120,60,${p.op * 0.75})`,
                boxShadow: `0 0 ${p.w * 4}px ${p.w * 1.5}px rgba(212,175,55,${p.op * 0.45})`,
                filter: `blur(${p.w > 4 ? 0.5 : 0}px)`,
              }}
              animate={{ y: [0, -(25 + i * 2.5), 0], opacity: [p.op * 0.35, p.op, p.op * 0.25], scale: [1, 1.4, 1] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
            />
          ))}

          {/* Tier C – Soft nebula puffs (8–18px, very blurred, slow pulse, 10 particles) */}
          {[
            { w:14, l:'10%', t:'30%', dur:12, del:0, op:0.12 },   { w:18, l:'30%', t:'70%', dur:15, del:2, op:0.09 },
            { w:12, l:'50%', t:'20%', dur:11, del:1, op:0.11 },   { w:16, l:'70%', t:'60%', dur:14, del:3, op:0.08 },
            { w:10, l:'88%', t:'40%', dur:10, del:1.5, op:0.13 }, { w:18, l:'20%', t:'10%', dur:16, del:0.5, op:0.07 },
            { w:14, l:'60%', t:'90%', dur:13, del:2.5, op:0.10 }, { w:12, l:'80%', t:'15%', dur:11, del:1.2, op:0.12 },
            { w:16, l:'40%', t:'50%', dur:14, del:3.5, op:0.08 }, { w:10, l:'5%',  t:'80%', dur:10, del:0.8, op:0.11 },
          ].map((p, i) => (
            <motion.div
              key={`puff-${i}`}
              className="absolute rounded-full"
              style={{ width: p.w, height: p.w, left: p.l, top: p.t,
                background: i % 2 === 0 ? `rgba(212,175,55,${p.op})` : `rgba(200,130,60,${p.op})`,
                filter: 'blur(6px)',
              }}
              animate={{ scale: [1, 1.6, 1], opacity: [p.op * 0.4, p.op, p.op * 0.3], y: [0, -12, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
            />
          ))}

          {/* Tier D – Ember streaks (thin rising lines, 8 particles) */}
          {[
            { l:'11%', t:'60%', dur:4, del:0.0 }, { l:'23%', t:'75%', dur:5, del:1.5 },
            { l:'43%', t:'65%', dur:3.5, del:0.7 }, { l:'61%', t:'80%', dur:4.5, del:2.0 },
            { l:'77%', t:'55%', dur:4,   del:0.3 }, { l:'88%', t:'70%', dur:5,   del:1.2 },
            { l:'34%', t:'85%', dur:3.8, del:1.8 }, { l:'54%', t:'72%', dur:4.2, del:0.9 },
          ].map((p, i) => (
            <motion.div
              key={`streak-${i}`}
              className="absolute"
              style={{ width: 1, height: 18, left: p.l, top: p.t, borderRadius: '1px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.7) 40%, rgba(249,229,150,0.9) 70%, transparent 100%)',
                boxShadow: '0 0 3px 1px rgba(212,175,55,0.3)',
              }}
              animate={{ y: [0, -80], opacity: [0, 0.8, 0], scaleY: [1, 0.4] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeOut', repeatDelay: p.dur * 0.8 }}
            />
          ))}
        </div>

        {/* ── Layer 7: Diagonal ink-wisp lines ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
          {[15, 35, 55, 75].map((deg, i) => (
            <div key={i} className="absolute" style={{ top: `${10 + i * 22}%`, left: '-20%', width: '140%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.8) 30%, rgba(249,229,150,1) 50%, rgba(212,175,55,0.8) 70%, transparent 100%)', transform: `rotate(${deg - 30}deg)`, transformOrigin: 'center' }} />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Ornate Header ── */}
          <div className="text-center mb-20">

            {/* Decorative ornament */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div style={{ height: '1px', width: 80, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6) 60%, rgba(212,175,55,0.9))' }} />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                style={{ width: 8, height: 8, background: 'var(--gold)', transform: 'rotate(45deg)', boxShadow: '0 0 12px 3px rgba(212,175,55,0.6)' }}
              />
              <div style={{ width: 12, height: 12, border: '1.5px solid rgba(212,175,55,0.5)', transform: 'rotate(45deg)', marginInline: '-4px' }} />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ width: 6, height: 6, background: 'rgba(249,229,150,0.9)', transform: 'rotate(45deg)', boxShadow: '0 0 8px 2px rgba(249,229,150,0.5)' }}
              />
              <div style={{ width: 12, height: 12, border: '1.5px solid rgba(212,175,55,0.5)', transform: 'rotate(45deg)', marginInline: '-4px' }} />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                style={{ width: 8, height: 8, background: 'var(--gold)', transform: 'rotate(45deg)', boxShadow: '0 0 12px 3px rgba(212,175,55,0.6)' }}
              />
              <div style={{ height: '1px', width: 80, background: 'linear-gradient(90deg, rgba(212,175,55,0.9), rgba(212,175,55,0.6) 40%, transparent)' }} />
            </motion.div>

            {/* Label */}
            <motion.span
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-block text-xs font-medium uppercase tracking-[0.3em] mb-5"
              style={{ color: 'rgba(212,175,55,0.75)' }}
            >
              Featured Collection
            </motion.span>

            {/* Heading – word-by-word stagger */}
            <div className="overflow-hidden mb-5">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="font-display tracking-tight leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-strong)' }}
              >
                Experience the{' '}
                <span style={{ background: 'linear-gradient(135deg, #F9E596 0%, #D4AF37 40%, #AA7E2D 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.35))' }}>
                  Magic
                </span>{' '}
                of Reading
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Interact with our featured collection. Click any book to open it and preview the story inside.
            </motion.p>

            {/* Bottom ornament hairline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-8 mx-auto"
              style={{ height: '1px', maxWidth: 320, background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 20%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.15) 80%, transparent 100%)' }}
            />
          </div>

          {/* 3D Book Showcase */}
          <div className="relative flex flex-col items-center justify-center min-h-[650px] py-12">
            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-[var(--surface-light)]/80 border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10 transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-[var(--surface-light)]/80 border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10 transition-all backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* 3D Book */}
            <Link
              to={`/book/${featuredBooks[carouselIndex]?.id}`}
              className="group relative"
              style={{ perspective: '1200px' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, rotateY: -40, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: -12, x: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 40, x: -100, scale: 0.8 }}
                  transition={{ duration: 0.7, type: 'spring', stiffness: 80, damping: 20 }}
                  className="relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Book Shadow */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-black/50 blur-2xl rounded-full" />

                  {/* Book Body */}
                  <div className="relative w-52 h-80 sm:w-64 sm:h-96 md:w-72 md:h-[420px]" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Pages (side view) */}
                    <div
                      className="absolute inset-y-2 right-0 w-5 md:w-6 rounded-r-sm"
                      style={{
                        background: 'linear-gradient(90deg, #e8dcc8 0%, #f5f0e6 30%, #e8dcc8 60%, #d4c4a8 100%)',
                        transform: 'rotateY(90deg) translateZ(0)',
                        transformOrigin: 'right',
                        boxShadow: 'inset 2px 0 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {/* Page lines */}
                      <div className="absolute inset-0 opacity-30">
                        {[...Array(30)].map((_, i) => (
                          <div key={i} className="h-px bg-[#b8a384]/40 mx-2 my-3" />
                        ))}
                      </div>
                    </div>

                    {/* Spine */}
                    <div
                      className="absolute inset-y-0 left-0 w-8 md:w-10 rounded-l-md"
                      style={{
                        background: 'linear-gradient(90deg, #1a120a 0%, #2a1f0e 40%, #1a120a 100%)',
                        transform: 'rotateY(-90deg) translateZ(0)',
                        transformOrigin: 'left',
                        boxShadow: 'inset -3px 0 10px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                        }}
                      >
                        <span className="text-[var(--gold)]/80 text-xs md:text-sm font-display tracking-wider truncate px-2">
                          {featuredBooks[carouselIndex]?.title}
                        </span>
                      </div>
                    </div>

                    {/* Front Cover */}
                    <div
                      className="absolute inset-0 rounded-r-lg overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{
                        transform: 'translateZ(16px)',
                        boxShadow: '8px 8px 30px rgba(0,0,0,0.4), 2px 2px 10px rgba(0,0,0,0.2)',
                      }}
                    >
                      <img
                        src={featuredBooks[carouselIndex]?.cover_url}
                        alt={featuredBooks[carouselIndex]?.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Cover overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {/* Cover shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                      {/* Title on cover */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                          {featuredBooks[carouselIndex]?.title}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                          {featuredBooks[carouselIndex]?.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Link>

            {/* Bottom Controls */}
            <div className="mt-16 flex flex-col items-center gap-6">
              <Link
                to={`/book/${featuredBooks[carouselIndex]?.id}`}
                className="btn-primary btn-shimmer flex items-center gap-2 px-10 py-4 text-sm font-semibold uppercase tracking-wider"
              >
                <BookOpen className="w-4 h-4" />
                Open Book
              </Link>

              {/* Pagination Dots */}
              <div className="flex gap-2">
                {featuredBooks.map((book, index) => (
                  <button
                    key={book.id}
                    onClick={(e) => { e.stopPropagation(); setCarouselIndex(index); }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      carouselIndex === index
                        ? 'bg-[var(--gold)] w-8'
                        : 'bg-white/20 hover:bg-white/40 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <StatsBar /> */}

      <section className="bg-[var(--color-surface)] section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 60 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-0.5 bg-[var(--color-accent)] mb-4"
              />
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-display text-3xl md:text-4xl font-medium text-[var(--color-text)] tracking-tight"
              >
                Recently Added Stories
              </motion.h2>
            </div>
            <Link
              to="/library"
              className="text-[var(--color-accent)] font-medium text-sm hover:underline hidden sm:block"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBooks.slice(0, 6).map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
