import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Tag,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import SkeletonCard from '../components/SkeletonCard';
import { fetchBooks, getBooksByGenre, type Book } from '../data/books';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState(searchParams.get('genre') || '');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [minRating, setMinRating] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isGenrePanelOpen, setIsGenrePanelOpen] = useState(false);

  useEffect(() => {
    async function loadBooks() {
      setIsLoading(true);
      const data = await fetchBooks();
      setBooks(data);
      setIsLoading(false);
    }
    loadBooks();
  }, []);

  useEffect(() => {
    const genre = searchParams.get('genre') || '';
    setActiveGenre(genre);
  }, [searchParams]);

  const handleGenreChange = (genre: string) => {
    setActiveGenre(genre);
    if (genre) {
      setSearchParams({ genre });
    } else {
      setSearchParams({});
    }
    setIsGenrePanelOpen(false);
  };

  const filteredBooks = useMemo(() => {
    let result = getBooksByGenre(books, activeGenre);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query)
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
        result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [books, activeGenre, searchQuery, sortBy, minRating]);

  const slides = [
    {
      image: '/images/poster_falana.png',
      label: 'CHARACTER REVEAL',
      title: 'Salt Sugar and Me',
      author: 'Ibukun Abodunrin',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A cinematic journey into mystery, destiny, and the unexpected pulse of a world on the edge of revelation.',
      character: 'Mr Falana',
      story: 'A wanderer carries an ancient compass that reveals hidden truths. As darkness spreads across the realm, Kade discovers the compass is not a tool of navigation, but a beacon calling to something far more dangerous.',
    },
    {
      image: '/images/poster_morounkeji.jpg',
      label: 'FEATURED',
      title: 'Salt Sugar and Me',
      author: 'Ibukun Abodunrin',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A cinematic journey into memory, power, and the whispers that shape a hidden empire.',
      character: 'Morounkeji',
      story: 'In a city where memories are currency, Sera possesses the rare gift to steal, restore, and rewrite them. When a faction of forgotten memories threatens to collapse reality itself, she must choose between preserving her identity or saving her world.',
    },
    {
      image: '/images/poster_adewale.jpg',
      label: 'CHARACTER REVEAL',
      title: 'Salt Sugar and Me',
      author: 'Ibukun Abodunrin',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A cinematic journey of insurgents, secrets, and the pulse of a city burning with forbidden light.',
      character: 'Adewale',
      story: 'A former soldier finds sanctuary in the underground resistance, where humans have learned to harness forbidden light. As he rises through their ranks, he uncovers a truth that forces him to question everything he has been fighting for.',
    },
  ];

  /* ─────────────── Banner Slider State ─────────────── */

  const [[currentSlide, direction], setSlideState] = useState([0, 0]);

  const paginate = useCallback((newDirection: number) => {
    setSlideState(([prev]) => [
      (prev + newDirection + slides.length) % slides.length,
      newDirection,
    ]);
  }, [slides.length]);

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
    setActiveGenre('');
    setMinRating(0);
    setSortBy('newest');
    setSearchParams({});
    setIsGenrePanelOpen(false);
    setIsFilterPanelOpen(false);
  };

  const isFiltered = searchQuery.trim() !== '' || activeGenre !== '' || minRating > 0 || sortBy !== 'newest';

  /* ───────────────────── Render ───────────────────── */

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-accent)] selection:text-[var(--color-bg)]">
      <Navbar />

      {/* Cinematic Banner Slider */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1700px] flex-col overflow-hidden lg:flex-row">
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
                <div className="relative h-1/2 w-full p-10 overflow-hidden lg:h-full lg:w-1/2">
                  <motion.img
                    custom={direction}
                    variants={imageVariants}
                    src={slides[currentSlide].image}
                    alt="Cinematic reveal poster"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)]/90 via-transparent to-transparent" />
                </div>

                {/* Text Content with Staggered Entrance */}
                <div className="relative flex w-full flex-1 flex-col justify-center px-6 py-10 text-white sm:px-8 lg:w-1/2 lg:px-12 lg:py-16 lg:pt-24">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={slides[currentSlide].image}
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
                    className="relative z-10 flex h-full flex-col justify-center gap-6 lg:gap-8"
                  >
                    <div className="space-y-5">
                      <motion.div variants={textItemVariants}>
                        <div className="inline-flex items-center rounded-full border border-[var(--color-accent)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)] sm:text-sm">
                          {slides[currentSlide].label}
                        </div>
                      </motion.div>

                      <div className="space-y-3">
                        <motion.h1
                          variants={textItemVariants}
                          className="font-serif text-4xl font-black leading-tight sm:text-5xl lg:text-6xl"
                        >
                          {slides[currentSlide].title}
                        </motion.h1>
                        <motion.p
                          variants={textItemVariants}
                          className="text-sm text-white/60 uppercase tracking-[0.24em] sm:text-base"
                        >
                          {slides[currentSlide].character}
                        </motion.p>
                      </div>

                      <motion.div variants={textItemVariants}>
                        <div className="h-px w-20 bg-[var(--color-accent)] opacity-90" />
                      </motion.div>

                      <motion.p
                        variants={textItemVariants}
                        className="max-w-xl text-sm leading-7 text-white/70 sm:text-base line-clamp-3"
                      >
                        {slides[currentSlide].description}
                      </motion.p>
                    </div>

                    <motion.p
                      variants={textItemVariants}
                      className="text-sm text-white/60 tracking-[0.24em] sm:text-base"
                    >
                      Author: {slides[currentSlide].author}
                    </motion.p>

                    <motion.div variants={textItemVariants} className="flex items-center justify-between">
                      <button className="inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]">
                        Coming Soon
                      </button>

                      <div className="flex items-center gap-2">
                        {slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-3 w-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[var(--color-accent)]' : 'bg-white/20 hover:bg-white/40'
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
          className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-3 text-white shadow-xl backdrop-blur-md transition-colors hover:bg-white/10 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-3 text-white shadow-xl backdrop-blur-md transition-colors hover:bg-white/10 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </section>

      {/* Main Interactive Controls & Grid */}
      <section className="pt-10 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ─────────────── Controls Bar ─────────────── */}
          <div className="bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 mb-8 shadow-2xl">

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

              {/* Right: Genres, Filters, Sort, View Toggle */}
              <div className="flex items-center gap-2 flex-wrap flex-shrink-0">

                {/* Genres Dropdown Button */}
                <button
                  onClick={() => setIsGenrePanelOpen(!isGenrePanelOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isGenrePanelOpen || activeGenre
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-bg)] shadow-lg shadow-[var(--color-accent)]/20'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface)]/80 text-[var(--color-text)]'
                    }`}
                >
                  <Tag className="w-4 h-4" />
                  <span className="hidden sm:inline">{activeGenre || 'All Genres'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isGenrePanelOpen ? 'rotate-180' : ''}`} />
                  {activeGenre && (
                    <span className="bg-[var(--color-bg)] text-[var(--color-accent)] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>

                {/* Filters Dropdown Button */}
                <button
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isFilterPanelOpen || minRating > 0
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
                    className="appearance-none bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-4 pr-10 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
                  >
                    <option value="newest">Newest Release</option>
                    <option value="rating">Top Rated</option>
                    <option value="az">Alphabetical (A-Z)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                </div>

                {/* View Mode Toggles */}
                <div className="flex items-center bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Genre Panel */}
            <AnimatePresence>
              {isGenrePanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--color-border)] mt-4 pt-4">
                    <span className="text-xs font-semibold uppercase text-[var(--color-muted)] tracking-wider mb-3 block">
                      Select Genre
                    </span>
                    <GenreFilter
                      activeGenre={activeGenre}
                      onGenreChange={handleGenreChange}
                      variant="pills"
                      isDark={true}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${minRating === rating
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
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 rounded-xl text-xs font-bold text-[var(--color-text)] transition-all self-end"
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-6"
              }>
                <SkeletonCard count={8} isDark={true} />
              </div>
            ) : filteredBooks.length > 0 ? (
              <motion.div
                layout
                className={viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-6"
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book, index) => (
                    <BookCard
                      key={book.id}
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
                className="text-center py-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl backdrop-blur-md"
              >
                <div className="w-20 h-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-[var(--color-accent)] opacity-80" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-[var(--color-text)] mb-2">
                  No stories found
                </h3>
                <p className="text-[var(--color-muted)] max-w-sm mx-auto">
                  Try adjusting your filters, searching for something else, or click below to clear your search details.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-bg)] font-semibold rounded-full shadow-lg shadow-[var(--color-accent)]/30 transition-all transform hover:scale-105"
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