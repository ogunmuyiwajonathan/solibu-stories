import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, type Variants, type PanInfo } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Star,
  BookOpen,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';
import { fetchBooks, type Book } from '../data/books';
import { fetchActiveBanners, type Banner } from '../data/banners';

type SortOption = 'newest' | 'rating' | 'az';

/* ──────────────── Slider Animation Config ──────────────── */

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 180,
      damping: 28,
      mass: 1.8,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    transition: {
      type: 'spring' as const,
      stiffness: 180,
      damping: 28,
      mass: 1.8,
    },
  }),
};

const imageVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '-26%' : '26%',
    scale: 1.12,
  }),
  center: {
    x: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 24,
      mass: 2.2,
      delay: 0.18,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '26%' : '-26%',
    scale: 1.12,
    transition: {
      type: 'spring' as const,
      stiffness: 180,
      damping: 28,
      mass: 1.8,
    },
  }),
};

const textContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.65,
      staggerChildren: 0.12,
    },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 320,
      damping: 32,
    },
  },
};

/* ───────────────────── Component ───────────────────── */

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [minRating, setMinRating] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [booksData, bannersData] = await Promise.all([fetchBooks(), fetchActiveBanners()]);
      setBooks(booksData);
      setBanners(bannersData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredBooks = useMemo(() => {
    let result = books;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    if (minRating > 0) {
      result = result.filter((book) => book.rating >= minRating);
    }

    switch (sortBy) {
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        result = [...result].sort((a, b) => b._creationTime - a._creationTime);
        break;
    }

    return result;
  }, [books, searchQuery, sortBy, minRating]);

  /* ─────────────── Banner Slider State ─────────────── */

  const [[currentSlide, direction], setSlideState] = useState([0, 0]);

  const paginate = useCallback((newDirection: number) => {
    setSlideState(([prev]) => [
      (prev + newDirection + banners.length) % banners.length,
      newDirection,
    ]);
  }, [banners.length]);

  const goToSlide = useCallback((index: number) => {
    setSlideState(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD) {
        paginate(1);
      } else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD) {
        paginate(-1);
      }
    },
    [paginate]
  );

  /* Auto-play: resets whenever currentSlide changes (manual or auto) */
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, paginate]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setMinRating(0);
    setSortBy('newest');
    setIsFilterPanelOpen(false);
  };

  const isFiltered = searchQuery.trim() !== '' || minRating > 0 || sortBy !== 'newest';

  /* ───────────────────── Render ───────────────────── */

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-accent)] selection:text-[var(--color-bg)]">
      <Navbar />

      {/* Cinematic Banner Slider */}
      {banners.length > 0 && (
      <section className="relative w-full min-h-[80dvh] md:h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />

        <div className="relative z-10 mx-auto flex h-full min-h-[80dvh] md:min-h-screen max-w-[1700px] flex-col overflow-hidden lg:flex-row">
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 flex h-full w-full flex-col overflow-hidden lg:flex-row"
              >
                {/* Poster Image with Parallax */}
                <div className="relative h-[40%] sm:h-1/2 w-full p-6 sm:p-10 overflow-hidden lg:h-full lg:w-1/2">
                  <motion.img
                    custom={direction}
                    variants={imageVariants}
                    src={banners[currentSlide].image_url}
                    alt="Cinematic reveal poster"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[var(--color-bg)]/90 lg:via-transparent lg:to-transparent" />
                </div>

                {/* Text Content with Staggered Entrance */}
                <div className="relative flex w-full flex-1 flex-col justify-center px-4 sm:px-6 py-6 sm:py-10 text-white lg:w-1/2 lg:px-12 lg:py-16 lg:pt-24">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={banners[currentSlide].image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-top scale-[1.3] blur-[50px]"
                    />
                    <div className="absolute inset-0 bg-black/90" />
                  </div>

                  <motion.div
                    variants={textContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="relative z-10 flex h-full flex-col justify-center gap-4 sm:gap-6 lg:gap-8"
                  >
                    <div className="space-y-3 sm:space-y-5">
                      <motion.div variants={textItemVariants}>
                        <div className="inline-flex items-center rounded-full border border-[var(--color-accent)] bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                          {banners[currentSlide].label}
                        </div>
                      </motion.div>

                      <div className="space-y-2 sm:space-y-3">
                        <motion.h1
                          variants={textItemVariants}
                          className="font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight"
                        >
                          {banners[currentSlide].title}
                        </motion.h1>
                        <motion.p
                          variants={textItemVariants}
                          className="text-[10px] sm:text-sm lg:text-base text-white/60 uppercase tracking-[0.24em]"
                        >
                          {banners[currentSlide].character_name}
                        </motion.p>
                      </div>

                      <motion.div variants={textItemVariants}>
                        <div className="h-px w-14 sm:w-20 bg-[var(--color-accent)] opacity-90" />
                      </motion.div>

                      <motion.p
                        variants={textItemVariants}
                        className="max-w-xl text-xs sm:text-sm lg:text-base leading-6 sm:leading-7 text-white/70 line-clamp-2 sm:line-clamp-3"
                      >
                        {banners[currentSlide].description}
                      </motion.p>
                    </div>

                    <motion.p
                      variants={textItemVariants}
                      className="text-[10px] sm:text-sm lg:text-base text-white/60 tracking-[0.24em]"
                    >
                      Author: {banners[currentSlide].author}
                    </motion.p>

                    <motion.div variants={textItemVariants} className="flex items-center justify-between gap-3">
                      {banners[currentSlide].cta_type === 'check_out_now' ? (
                        <button
                          onClick={() => document.getElementById('main-grid')?.scrollIntoView({ behavior: 'smooth' })}
                          className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-5 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-bg)] transition-all hover:brightness-110 whitespace-nowrap"
                        >
                          Check Out Now
                        </button>
                      ) : (
                        <button className="inline-flex items-center justify-center rounded-full border border-[#d4af37] bg-transparent px-5 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-[var(--color-bg)] whitespace-nowrap">
                          Coming Soon
                        </button>
                      )}

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {banners.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[var(--color-accent)] w-4 sm:w-3' : 'bg-white/20 hover:bg-white/40 w-2 sm:w-3'
                              }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,155,90,0.12),_transparent_32%)] opacity-60" />
        </div>

        <button
          onClick={() => paginate(-1)}
          className="absolute left-3 sm:left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 sm:p-3 text-white shadow-xl backdrop-blur-md transition-colors hover:bg-white/10 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-3 sm:right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 sm:p-3 text-white shadow-xl backdrop-blur-md transition-colors hover:bg-white/10 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </section>
      )}

      {/* Main Interactive Controls & Grid */}
      <section id="main-grid" className="pt-6 sm:pt-10 pb-16 sm:pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ─────────────── Controls Bar ─────────────── */}
          <div className="bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl p-3 sm:p-5 mb-6 sm:mb-8 shadow-2xl">

            {/* Top Row: Search + Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

              {/* Search */}
              <div className="w-full sm:w-64 md:w-72 flex-shrink-0">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="w-full"
                />
              </div>

              {/* Right: Filters, Sort, View Toggle */}
              <div className="flex items-center gap-2 flex-wrap flex-shrink-0">

                {/* Filters Dropdown Button */}
                <button
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl border text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isFilterPanelOpen || minRating > 0
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-bg)] shadow-lg shadow-[var(--color-accent)]/20'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface)]/80 text-[var(--color-text)]'
                    }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {minRating > 0 && (
                    <span className="bg-[var(--color-bg)] text-[var(--color-accent)] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 min-h-[44px] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="rating">Top Rated</option>
                    <option value="az">A-Z</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                </div>

                {/* View Mode Toggles */}
                <div className="flex items-center bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Filter Panel */}
            <AnimatePresence>
              {isFilterPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase text-[var(--color-muted)] tracking-wider">
                        Minimum Rating
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[0, 4.0, 4.5, 4.7].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMinRating(rating)}
                            className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold transition-all border ${minRating === rating
                                ? 'bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)]'
                                : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 border-[var(--color-border)] text-[var(--color-text)]'
                              }`}
                          >
                            {rating === 0 ? (
                              <span>All Ratings</span>
                            ) : (
                              <>
                                <Star className="w-3.5 h-3.5 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                                <span>{rating}+</span>
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isFiltered && (
                      <button
                        onClick={clearAllFilters}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 rounded-xl text-xs font-bold text-[var(--color-text)] transition-all self-start sm:self-end"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear All Filters</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Book Cards Display Area */}
          <div>
            {isLoading ? (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                : "flex flex-col gap-4 sm:gap-6"
              }>
                <SkeletonCard count={8} isDark={true} />
              </div>
            ) : filteredBooks.length > 0 ? (
              <motion.div
                layout
                className={viewMode === 'grid'
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                  : "flex flex-col gap-4 sm:gap-6"
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book, index) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      index={index}
                      layout={viewMode}
                      isDark={true}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 sm:py-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl backdrop-blur-md px-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-accent)] opacity-80" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[var(--color-text)] mb-2">
                  No stories found
                </h3>
                <p className="text-[var(--color-muted)] max-w-sm mx-auto text-sm sm:text-base">
                  Try adjusting your filters, searching for something else, or click below to clear your search details.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 min-h-[44px] bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-bg)] font-semibold rounded-full shadow-lg shadow-[var(--color-accent)]/30 transition-all transform hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}
