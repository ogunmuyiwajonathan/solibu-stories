import { motion } from 'framer-motion';
import { genres } from '../data/books';
import { Sparkles, Heart, Search, Rocket, Swords, BookOpen } from 'lucide-react';

interface GenreFilterProps {
  activeGenre: string;
  onGenreChange: (genre: string) => void;
  variant?: 'pills' | 'buttons';
  isDark?: boolean;
}

const genreIcons: Record<string, React.ReactNode> = {
  All: <BookOpen className="w-4 h-4" />,
  Fantasy: <Sparkles className="w-4 h-4" />,
  Romance: <Heart className="w-4 h-4" />,
  Mystery: <Search className="w-4 h-4" />,
  'Sci-Fi': <Rocket className="w-4 h-4" />,
  Action: <Swords className="w-4 h-4" />,
};

export default function GenreFilter({ activeGenre, onGenreChange, variant = 'buttons', isDark = false }: GenreFilterProps) {
  if (variant === 'pills') {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full">
        {genres.map((genre) => {
          const isActive = (genre === 'All' && !activeGenre) || genre === activeGenre;
          return (
            <button
              key={genre}
              onClick={() => onGenreChange(genre === 'All' ? '' : genre)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-[#C89B5A] text-[#1D1307] shadow-lg shadow-[#C89B5A]/25 scale-105'
                  : isDark
                  ? 'bg-[#2E2219] text-[#F4E8D5] hover:bg-[#3B2D24] border border-[#3E2F24]'
                  : 'bg-[#F8EEE2] text-[#3A291F] hover:bg-[#F2E7D4] border border-[#E4D7C5]'
              }`}
            >
              {genreIcons[genre]}
              {genre}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {genres.map((genre, index) => {
        const isActive = (genre === 'All' && !activeGenre) || genre === activeGenre;
        return (
          <motion.button
            key={genre}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onGenreChange(genre === 'All' ? '' : genre)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 genre-pill ${
              isActive
                ? 'bg-[#C89B5A] text-[#1D1307] shadow-lg shadow-[#C89B5A]/20'
                : isDark
                ? 'bg-[#2E2219] text-[#F4E8D5] hover:bg-[#3B2D24] border border-[#3E2F24]'
                : 'bg-[#F8EEE2] text-[#3A291F] hover:bg-[#F2E7D4] border border-[#E4D7C5]'
            }`}
          >
            {genreIcons[genre]}
            {genre}
          </motion.button>
        );
      })}
    </div>
  );
}

