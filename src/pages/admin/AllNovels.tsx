import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Pencil, Trash2, AlertCircle, Star, X, Loader2 } from 'lucide-react';
import { fetchBooks, deleteBook, type Book } from '../../data/books';
import SearchBar from '../../components/SearchBar';

export default function AllNovels() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    const data = await fetchBooks();
    setBooks(data);
    setIsLoading(false);
  };

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const query = searchQuery.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  const handleDelete = async (id: number) => {
    if (deleteConfirm === id) {
      const success = await deleteBook(id);
      if (success) setBooks((prev) => prev.filter((b) => b.id !== id));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] tracking-tight">
          All Novels
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Manage your collection</p>
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search novels..." />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[var(--color-surface)] backdrop-blur-sm rounded-xl border border-[var(--border-soft)] overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-soft)]">
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Cover</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Author</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Genre</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Rating</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">PDF</th>
                  <th className="text-right px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-soft)]">
                <AnimatePresence>
                  {filteredBooks.map((book, index) => (
                    <motion.tr
                      key={book.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-[var(--surface-light)] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[var(--text-strong)] font-medium text-sm">{book.title}</p>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{book.author}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium px-2.5 py-1 rounded-full">
                          {book.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                          <span className="text-[var(--text-strong)] text-sm">{book.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {book.pdf_url ? (
                          <span className="bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium px-2.5 py-1 rounded-full">
                            Uploaded
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)] text-xs">No PDF</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {deleteConfirm === book.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--destructive)] text-xs">Confirm?</span>
                              <button
                                onClick={() => handleDelete(book.id)}
                                className="p-2 bg-[var(--destructive)]/20 text-[var(--destructive)] rounded-lg hover:bg-[var(--destructive)]/30 transition-colors"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-2 bg-[var(--surface-light)] text-[var(--text-muted)] rounded-lg hover:bg-[var(--surface-light)]/80 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Link
                                to={`/admin/novels/edit/${book.id}`}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(book.id)}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-muted)]">No novels found matching your search.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
