import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpen, ArrowRight } from 'lucide-react';
import type { Book } from '../data/books';

interface BookCardProps {
  book: Book;
  index?: number;
  layout?: 'grid' | 'list';
  isDark?: boolean;
}

export default function BookCard({ book, index = 0, layout = 'grid', isDark = false }: BookCardProps) {
  const isList = layout === 'list';

  if (isList) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
      >
        <Link to={`/book/${book.id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
          <div className={`flex flex-col sm:flex-row rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl border ${
            isDark
              ? 'bg-[#1B140E] backdrop-blur-xl border-white/10 hover:border-[#C89B5A]/40 hover:bg-[#2B1F16]'
              : 'bg-[#F8EEE2] border-[#E4D7C5] hover:bg-[#FEF6EA] hover:border-[#C89B5A]/30 shadow-sm'
          }`}>
            <div className="relative w-full sm:w-48 md:w-56 aspect-[3/4] sm:aspect-auto sm:h-64 overflow-hidden flex-shrink-0">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0905]/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {book.featured && (
                <div className="absolute top-3 left-3">
                  <span className="bg-[#C89B5A] text-[#1D1307] text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-[#C89B5A]/30">
                    Featured
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#F6E9D6] text-[#6B5237] text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {book.genre}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#C89B5A] text-[#C89B5A]" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-[#F4E8D5]' : 'text-[#3A291F]'}`}>{book.rating}</span>
                  </div>
                </div>

                <h3 className={`font-display text-2xl font-bold mt-3 group-hover:text-[#C89B5A] transition-colors line-clamp-1 ${
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
                  Added: {new Date(book.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
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
      <Link to={`/book/${book.id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
        <div className={`rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border ${
          isDark
            ? 'bg-[#1B140E] border-white/10 hover:border-[#C89B5A]/40 shadow-xl'
            : 'bg-[#F8EEE2] border-[#E4D7C5] hover:bg-[#FEF6EA] hover:border-[#C89B5A]/30 shadow-sm'
        }`}>
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0905]/80 via-transparent to-transparent opacity-50 group-hover:opacity-85 transition-opacity duration-500" />

            {book.featured && (
              <div className="absolute top-3 left-3">
                <span className="bg-[#C89B5A] text-[#1D1307] text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-[#C89B5A]/30">
                  Featured
                </span>
              </div>
            )}

            <div className="absolute bottom-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-[#C89B5A] text-[#1D1307] p-3 rounded-full shadow-lg">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-[#F6E9D6] text-[#6B5237] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg">
                {book.genre}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C89B5A] text-[#C89B5A]" />
                <span className={`text-xs font-bold ${isDark ? 'text-[#F4E8D5]' : 'text-[#3A291F]'}`}>{book.rating}</span>
              </div>
            </div>

            <h3 className={`font-display text-lg font-bold line-clamp-1 group-hover:text-[#C89B5A] transition-colors ${
              isDark ? 'text-[#F4E8D5]' : 'text-[#3A291F]'
            }`}>
              {book.title}
            </h3>
            <p className={`text-sm mt-1 line-clamp-1 ${isDark ? 'text-[#BBAE98]' : 'text-[#7C6C5F]'}`}>{book.author}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

