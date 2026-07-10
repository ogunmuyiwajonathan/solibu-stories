import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Plus, Eye, TrendingUp, Loader2 } from 'lucide-react';
import { fetchBooks, type Book } from '../../data/books';

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchBooks();
      setBooks(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const featuredCount = useMemo(() => books.filter(b => b.featured).length, [books]);
  const recentBooks = useMemo(
    () => [...books].sort((a, b) => (b.last_updated ?? b._creationTime) - (a.last_updated ?? a._creationTime)).slice(0, 5),
    [books]
  );

  const statCards = [
    { label: 'Total Novels', value: books.length, icon: <BookOpen className="w-5 h-5" />, color: 'text-[var(--gold)]' },
    { label: 'Featured', value: featuredCount, icon: <Star className="w-5 h-5" />, color: 'text-[var(--gold-soft)]' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] tracking-tight">
          Dashboard
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Overview of your novel collection</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-[var(--color-surface)] backdrop-blur-sm rounded-xl p-6 border-t-2 border-[var(--gold)]"
          >
            <div className={`${stat.color} mb-3`}>{stat.icon}</div>
            <p className="font-display text-3xl font-semibold text-[var(--text-strong)]">{stat.value}</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <Link
          to="/admin/novels/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--gold)] text-[var(--color-bg)] rounded-xl font-medium text-sm hover:bg-[var(--gold-deep)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Novel
        </Link>
        <Link
          to="/admin/novels"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-light)] text-[var(--text-strong)] rounded-xl font-medium text-sm hover:bg-[var(--surface-light)]/80 transition-colors border border-[var(--border-soft)]"
        >
          <Eye className="w-4 h-4" />
          All Novels
        </Link>
        <Link
          to="/admin/banners"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-light)] text-[var(--text-strong)] rounded-xl font-medium text-sm hover:bg-[var(--surface-light)]/80 transition-colors border border-[var(--border-soft)]"
        >
          <Eye className="w-4 h-4" />
          All Banners
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[var(--color-surface)] backdrop-blur-sm rounded-xl border border-[var(--border-soft)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[var(--border-soft)] flex items-center justify-between">
          <h3 className="font-display text-lg text-[var(--text-strong)]">Recent Additions</h3>
          <TrendingUp className="w-4 h-4 text-[var(--gold)]" />
        </div>
        <div className="divide-y divide-[var(--border-soft)]">
          {recentBooks.map((book) => (
            <Link key={book._id} to="/admin/novels" className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--surface-light)] transition-colors cursor-pointer">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-10 h-14 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-strong)] font-medium text-sm truncate">{book.title}</p>
                <p className="text-[var(--text-muted)] text-xs">{book.author}</p>
              </div>
              <span className="text-[var(--text-muted)] text-xs">
                {new Date(book._creationTime).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
