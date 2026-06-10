import { useRef, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, BookOpen, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import BookCard from '../components/BookCard';
import { fetchBooks, getBookById, getRelatedBooks, type Book } from '../data/books';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = parseInt(id || '0');

  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);

  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const z = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0]);

  useEffect(() => {
    async function loadBookData() {
      setIsLoading(true);
      const books = await fetchBooks();
      const foundBook = getBookById(books, bookId);
      if (foundBook) {
        setBook(foundBook);
        setRelatedBooks(getRelatedBooks(books, bookId, foundBook.genre));
      }
      setIsLoading(false);
    }
    loadBookData();
  }, [bookId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[var(--color-accent)] animate-spin" />
        <p className="text-[var(--color-muted)] font-medium text-sm">Opening Book Info...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-accent)]/30">
          <h2 className="font-display text-2xl text-[var(--color-text)] mb-4">Book not found</h2>
          <Link to="/library" className="btn-primary">Back to Library</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <section ref={sectionRef} className="relative pt-20 overflow-hidden">
        <motion.div
          style={{
            opacity: bgOpacity,
            backgroundImage: `url(${book.cover_url})`,
          }}
          className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/90 via-[var(--color-bg)]/80 to-[var(--color-bg)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="w-full md:w-72 lg:w-80 flex-shrink-0" style={{ perspective: 1000 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ 
                  rotateY, 
                  rotateX, 
                  scale,
                  z,
                  transformStyle: "preserve-3d"
                }}
                className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl"
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ opacity: textOpacity }}
              className="flex-1"
            >
              <span className="inline-block bg-[var(--color-badge-bg)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-sm">
                {book.genre}
              </span>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-[var(--color-text)] tracking-tight">
                {book.title}
              </h1>

              <p className="mt-2 text-[var(--color-muted)] text-lg">
                by <span className="text-[var(--color-text)]/80">{book.author}</span>
              </p>

              <div className="flex items-center gap-4 mt-4">
                <StarRating rating={book.rating} size="md" />
                <span className="text-[var(--color-text)]/80 font-medium">{book.rating}</span>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>{new Date(book.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>~6 hours read</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>12 chapters</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-display text-lg text-[var(--color-text)] mb-3">Synopsis</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  {book.synopsis}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {book.pdf_url ? (
                  <Link 
                    to={`/read/${book.id}`}
                    className="btn-primary btn-shimmer flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Start Reading
                  </Link>
                ) : (
                  <>
                    <button 
                      disabled
                      className="px-6 py-3 rounded-full font-medium text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] cursor-not-allowed flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Start Reading
                    </button>
                    <span className="inline-flex items-center px-5 py-3 rounded-full border border-dashed border-[var(--color-accent)] text-[var(--color-accent)] text-sm font-medium animate-pulse bg-[var(--color-accent)]/5 backdrop-blur-sm">
                      Coming Soon
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {relatedBooks.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="font-display text-2xl md:text-3xl font-medium text-[var(--color-text)] tracking-tight mb-8"
            >
              More in {book.genre}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook, index) => (
                <BookCard key={relatedBook.id} book={relatedBook} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
