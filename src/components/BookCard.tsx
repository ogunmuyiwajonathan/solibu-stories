import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpen, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '@clerk/react';
import { useIsFavourited, useAddFavourite, useRemoveFavourite } from '../data/favourites';
import type { Id } from 'convex/_generated/dataModel';
import type { Book } from '../data/books';

interface BookCardProps {
  book: Book;
  index?: number;
  layout?: 'grid' | 'list';
  isDark?: boolean;
}

export default function BookCard({ book, index = 0, layout = 'grid', isDark = false }: BookCardProps) {
  const isList = layout === 'list';
  const navigate = useNavigate();
  const { isSignedIn, userId } = useAuth();
  const isFav = useIsFavourited(
    userId ?? undefined,
    book._id as Id<"books">
  );
  const addFav = useAddFavourite();
  const removeFav = useRemoveFavourite();

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn || !userId) {
      navigate('/signin');
      return;
    }
    if (isFav) {
      await removeFav({ book_id: book._id as Id<"books"> });
    } else {
      await addFav({ book_id: book._id as Id<"books"> });
    }
  };

  if (isList) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
      >
        <Link to={`/book/${book._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
          <div className={`flex flex-col sm:flex-row rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl border ${
            isDark
              ? 'bg-[#1B140E] backdrop-blur-xl border-white/10 hover:border-[#C89B5A]/40 hover:bg-[#2B1F16]'
              : 'bg-[#F8EEE2] border-[#E4D7C5] hover:bg-[#FEF6EA] hover:border-[#C89B5A]/30 shadow-sm'
          }`}>
            <div className="relative w-full sm:w-40 md:w-48 lg:w-56 aspect-[3/4] sm:aspect-auto sm:h-48 md:h-56 lg:h-64 overflow-hidden flex-shrink-0">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={400}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0905]/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {book.featured && (
                <div className="absolute top-3 left-3">
                  <span className="bg-[#C89B5A] text-[#1D1307] text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-[#C89B5A]/30">
                    Featured
                  </span>
                </div>
              )}

              <button
                onClick={handleToggleFav}
                className="absolute top-3 right-3 z-10 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
              >
                <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-red-400'}`} />
              </button>
            </div>

            <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#C89B5A] text-[#C89B5A]" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-[#F4E8D5]' : 'text-[#3A291F]'}`}>{book.rating}</span>
                  </div>
                </div>

                <h3 className={`font-display text-xl sm:text-2xl font-bold mt-3 group-hover:text-[#C89B5A] transition-colors line-clamp-1 ${
                  isDark ? 'text-[#F4E8D5]' : 'text-[#3A291F]'
                }`}>
                  {book.title}
                </h3>
                <p className="text-[#6B5237] font-medium text-sm mt-1">{book.author}</p>
                <p className={`mt-3 text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed ${
                  isDark ? 'text-[#BBAE98]' : 'text-[#7C6C5F]'
                }`}>
                  {book.synopsis}
                </p>
              </div>

              <div className="border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0 mt-4 flex items-center justify-between">
                <span className={`text-xs ${isDark ? 'text-[#BBAE98]' : 'text-[#7C6C5F]'}`}>
                  Added: {new Date(book._creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </span>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#C89B5A] group-hover:translate-x-1 transition-transform">
                  <span>Read Book</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
    >
      <Link to={`/book/${book._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
        <div className={`rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border ${
          isDark
            ? 'bg-[#1B140E] border-white/10 hover:border-[#C89B5A]/40 shadow-xl'
            : 'bg-[#F8EEE2] border-[#E4D7C5] hover:bg-[#FEF6EA] hover:border-[#C89B5A]/30 shadow-sm'
        }`}>
          <div className="relative aspect-[2/3] overflow-hidden bg-[#0a0705]">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width={400}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0905]/80 via-transparent to-transparent opacity-50 group-hover:opacity-85 transition-opacity duration-500" />

            {book.featured && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                <span className="bg-[#C89B5A] text-[#1D1307] text-[9px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-lg shadow-[#C89B5A]/30">
                  Featured
                </span>
              </div>
            )}

            <button
              onClick={handleToggleFav}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-red-400'}`} />
            </button>

            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-[#C89B5A] text-[#1D1307] p-2 sm:p-2.5 rounded-full shadow-lg">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>

          <div className="p-2.5 sm:p-5">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#C89B5A] text-[#C89B5A]" />
                <span className={`text-[10px] sm:text-xs font-bold ${isDark ? 'text-[#F4E8D5]' : 'text-[#3A291F]'}`}>{book.rating}</span>
              </div>
            </div>

            <h3 className={`font-display text-[13px] sm:text-lg font-bold line-clamp-1 group-hover:text-[#C89B5A] transition-colors ${
              isDark ? 'text-[#F4E8D5]' : 'text-[#3A291F]'
            }`}>
              {book.title}
            </h3>
            <p className={`text-[11px] sm:text-sm mt-0.5 sm:mt-1 line-clamp-1 ${isDark ? 'text-[#BBAE98]' : 'text-[#7C6C5F]'}`}>{book.author}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
