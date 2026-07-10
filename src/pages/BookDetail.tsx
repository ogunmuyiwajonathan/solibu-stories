import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, BookOpen, Loader2, Heart, ShoppingCart, Send, Trash2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import BookCard from '../components/BookCard';
import { fetchBookById, getRelatedBooks, type Book } from '../data/books';
import { useAuth } from '../hooks/useAuth';
import { fetchFavouriteBookIds, addFavourite, removeFavourite } from '../data/favourites';
import { fetchReviews, fetchUserReview, addReview, updateReview, deleteReview, type Review } from '../data/reviews';
import type { Id } from '../../convex/_generated/dataModel';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isFav, setIsFav] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(false);

  useEffect(() => {
    async function loadBookData() {
      setIsLoading(true);
      if (!id) { setIsLoading(false); return; }
      const foundBook = await fetchBookById(id);
      if (foundBook) {
        setBook(foundBook);
        setRelatedBooks(await getRelatedBooks(foundBook));
      }
      setIsLoading(false);
    }
    loadBookData();
  }, [id]);

  useEffect(() => {
    async function loadFavAndReviews() {
      if (!id) return;
      if (user) {
        const favIds = await fetchFavouriteBookIds(user.id);
        setIsFav(favIds.includes(id));
        const ur = await fetchUserReview(user.id, id);
        setUserReview(ur);
        if (ur) setReviewForm({ rating: ur.rating, content: ur.content || '' });
      }
      const revs = await fetchReviews(id);
      setReviews(revs);
    }
    loadFavAndReviews();
  }, [id, user]);

  const handleToggleFavourite = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!id) return;
    if (isFav) {
      await removeFavourite(user.id, id as Id<"books">);
      setIsFav(false);
      toast.success('Removed from favourites');
    } else {
      await addFavourite(user.id, id as Id<"books">);
      setIsFav(true);
      toast.success('Added to favourites');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) { navigate('/signin'); return; }
    setIsSubmittingReview(true);
    try {
      if (editingReview && userReview) {
        await updateReview(userReview._id, { rating: reviewForm.rating, content: reviewForm.content });
        toast.success('Review updated');
      } else {
        await addReview({ book_id: id, rating: reviewForm.rating, content: reviewForm.content });
        toast.success('Review submitted');
      }
      const ur = await fetchUserReview(user.id, id);
      setUserReview(ur);
      setEditingReview(false);
      const revs = await fetchReviews(id);
      setReviews(revs);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    if (!confirm('Delete your review?')) return;
    await deleteReview(userReview._id);
    setUserReview(null);
    setReviewForm({ rating: 5, content: '' });
    setEditingReview(false);
    if (id) {
      const revs = await fetchReviews(id);
      setReviews(revs);
    }
    toast.success('Review deleted');
  };

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
        <div className="text-center bg-[var(--color-surface)] p-8 rounded-2xl border border-[var(--color-accent)]/30 mx-4">
          <h2 className="font-display text-2xl text-[var(--color-text)] mb-4">Book not found</h2>
          <Link to="/library" className="btn-primary">Back to Library</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-20 pb-8 md:pb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12">
            <div className="w-full max-w-[280px] sm:max-w-sm mx-auto md:mx-0 md:w-72 lg:w-80 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl relative bg-[#0a0705]"
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  width={400}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1"
            >
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[var(--color-text)] tracking-tight">
                {book.title}
              </h1>

              <p className="mt-2 text-[var(--color-muted)] text-base sm:text-lg">
                by <span className="text-[var(--color-text)]/80">{book.author}</span>
              </p>

              {user && (
                <div className="flex items-center gap-4 mt-4">
                  <StarRating rating={book.rating} size="md" />
                  <span className="text-[var(--color-text)]/80 font-medium">{book.rating}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{new Date(book._creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                {book.reading_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{book.reading_time}</span>
                  </div>
                )}
                {book.chapters && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{book.chapters} chapters</span>
                  </div>
                )}
              </div>

              <div className="mt-6 sm:mt-8">
                <h3 className="font-display text-base sm:text-lg text-[var(--color-text)] mb-3">Synopsis</h3>
                <p className="text-[var(--color-muted)] text-sm sm:text-base leading-relaxed">
                  {book.synopsis}
                </p>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={book.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-full font-medium text-sm bg-[#d4af37] text-white hover:bg-[#d4af37]/90 transition-colors w-full sm:w-auto"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </a>

                <button
                  onClick={handleToggleFavourite}
                  className={`flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-full font-medium text-sm border transition-all w-full sm:w-auto ${
                    isFav
                      ? 'bg-red-500/10 border-red-500/30 text-red-500'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                  {isFav ? 'Favourited' : 'Favourite'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 sm:py-16 md:py-20">
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
            className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-[var(--color-text)] tracking-tight mb-6 sm:mb-8"
          >
            Reviews ({reviews.length})
          </motion.h2>

          {/* Write / Edit Review Form */}
          {user && (editingReview || !userReview) && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitReview}
              className="mb-8 bg-[var(--color-surface)] border border-[var(--border-soft)] rounded-xl p-4 sm:p-6"
            >
              <h3 className="font-display text-base sm:text-lg text-[var(--text-strong)] mb-4">
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Your Rating</label>
                <StarRating
                  rating={reviewForm.rating}
                  size="md"
                  interactive
                  onChange={(r) => setReviewForm((prev) => ({ ...prev, rating: r }))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Your Review</label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  placeholder="Share your thoughts about this book..."
                  className="w-full px-4 py-3 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-medium rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button>
                {editingReview && (
                  <button
                    type="button"
                    onClick={() => { setEditingReview(false); if (userReview) setReviewForm({ rating: userReview.rating, content: userReview.content || '' }); }}
                    className="px-5 py-2.5 min-h-[44px] rounded-xl font-medium text-sm text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.form>
          )}

          {!user && (
            <div className="mb-8 bg-[var(--color-surface)] border border-[var(--border-soft)] rounded-xl p-6 text-center">
              <p className="text-[var(--text-muted)] mb-3">Sign in to write a review</p>
              <Link to="/signin" className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-[var(--gold)] text-[var(--color-bg)] font-medium rounded-xl hover:bg-[var(--gold-deep)] transition-colors">
                Sign In
              </Link>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4 sm:space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-[var(--color-surface)] border border-[var(--border-soft)] rounded-xl p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--gold)] text-xs sm:text-sm font-semibold">
                        {'U'.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[var(--text-strong)] font-medium text-sm">
                        {'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-[var(--text-muted)] text-xs whitespace-nowrap">
                          {new Date(review._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {user && user.id === review.user_id && !editingReview && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setEditingReview(true); setReviewForm({ rating: review.rating, content: review.content || '' }); }}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDeleteReview}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {review.content && (
                  <p className="mt-3 text-[var(--color-muted)] text-sm leading-relaxed">{review.content}</p>
                )}
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-[var(--text-muted)] text-center py-8">No reviews yet. Be the first to review this book!</p>
            )}
          </div>
        </div>
      </section>

      {relatedBooks.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20">
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
              className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-[var(--color-text)] tracking-tight mb-6 sm:mb-8"
            >
              You May Also Like
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedBooks.map((relatedBook, index) => (
                <BookCard key={relatedBook._id} book={relatedBook} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
