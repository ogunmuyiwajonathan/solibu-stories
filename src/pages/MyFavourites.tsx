import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { fetchBooks, type Book } from '../data/books';
import { fetchFavouriteBookIds, removeFavourite } from '../data/favourites';
import type { Id } from 'convex/_generated/dataModel';

export default function MyFavourites() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const favIds = await fetchFavouriteBookIds(user.id);
      const allBooks = await fetchBooks();
      const favBooks = allBooks.filter((b) => favIds.includes(b._id as Id<"books">));
      setBooks(favBooks);
      setLoading(false);
    }
    if (user) load();
  }, [user]);

  const handleUnfavourite = async (bookId: Id<"books">) => {
    if (!user) return;
    await removeFavourite(user.id, bookId);
    setBooks((prev) => prev.filter((b) => b._id !== bookId));
    toast.success('Removed from favourites');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[var(--color-accent)] animate-spin" />
        <p className="text-[var(--color-muted)] font-medium text-sm">Loading your favourites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section className="pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-0.5 bg-[var(--color-accent)] mb-4"
          />
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-medium text-[var(--color-text)] tracking-tight mb-8"
          >
            My Favourites ({books.length})
          </motion.h1>

          {books.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-muted)] text-lg mb-4">You haven't added any favourites yet.</p>
              <Link to="/library" className="btn-primary inline-flex items-center gap-2">
                Browse Library
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div className="group relative rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--border-soft)] hover:border-[var(--color-accent)]/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <Link to={`/book/${book._id}`} onClick={() => window.scrollTo(0, 0)}>
                      <div className="aspect-[2/3] overflow-hidden">
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-base font-semibold text-[var(--text-strong)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-[var(--text-muted)] text-sm mt-1 line-clamp-1">{book.author}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleUnfavourite(book._id)}
                      className="absolute top-3 right-3 p-2 bg-[var(--color-bg)]/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500/20 transition-colors opacity-100 sm:opacity-0 group-hover:sm:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
