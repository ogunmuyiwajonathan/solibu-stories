import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../data/books';

interface HeroBookProps {
  book: Book;
  onBookChange: (book: Book) => void;
  books: Book[];
}

export default function HeroBook({ book, onBookChange, books }: HeroBookProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);

  return (
    <div className="flex flex-col items-center">
      <div className="book-container">
        <div className={`book ${isOpen ? 'book--open' : ''}`}>
          <div className="book__front">
            <div
              className="book__cover"
              style={{ backgroundImage: `url(${book.cover_url})` }}
            >
              <div className="book__cover-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-[#F4E8D5] mb-1">
                  {book.title}
                </h3>
                <p className="text-[#D7C5A3] text-sm">{book.author}</p>
              </div>
            </div>
          </div>

          <div className="book__back" />

          <div className="book__spine">
            <span className="book__spine-text">{book.title}</span>
          </div>

          <div className="book__pages">
            <div className="page-edge" />

            <div className="book__page-left">
              <div className="book__page-faint-text">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 bg-[#1F1610]/10 rounded mb-2"
                    style={{ width: `${60 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="book__page-right">
              <h4 className="font-display text-lg md:text-xl font-semibold text-[#3A291F] mb-2">
                {book.title}
              </h4>
              <p className="text-[#7C6C5F] text-xs mb-4">by {book.author}</p>

              <div className="w-12 h-0.5 bg-[#C89B5A] mb-4" />

              <p className="text-[#3A291F] text-xs leading-relaxed line-clamp-6">
                {book.synopsis}
              </p>

              <div className="mt-4 pt-4 border-t border-[#D4B98A]/40">
                <span className="inline-block bg-[#F6E9D6] text-[#6B5237] text-xs font-medium px-2 py-0.5 rounded">
                  {book.genre}
                </span>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < Math.floor(book.rating) ? 'text-[#C89B5A]' : 'text-[#D7C5A3]'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-[#7C6C5F] ml-1">{book.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          navigate(`/book/${book.id}`);
          window.scrollTo(0, 0);
        }}
        className="mt-8 btn-primary btn-shimmer flex items-center gap-2"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" />
            Close Book
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4" />
            Open Book
          </>
        )}
      </motion.button>

      <div className="mt-10 flex gap-3">
        {featuredBooks.map((fb) => (
          <motion.button
            key={fb.id}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onBookChange(fb);
              setIsOpen(false);
            }}
            className={`w-14 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              fb.id === book.id
                ? 'border-[#C89B5A] shadow-lg shadow-[#C89B5A]/20'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={fb.cover_url}
              alt={fb.title}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
