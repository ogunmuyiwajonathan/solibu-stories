import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Pencil, Trash2, Check, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { fetchBanners, deleteBanner, type Banner } from '../../data/banners';
import SearchBar from '../../components/SearchBar';
import type { Id } from 'convex/_generated/dataModel';

export default function AllBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"banners"> | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setIsLoading(true);
    const data = await fetchBanners();
    setBanners(data);
    setIsLoading(false);
  };

  const filteredBanners = useMemo(() => {
    if (!searchQuery.trim()) return banners;
    const query = searchQuery.toLowerCase();
    return banners.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.label.toLowerCase().includes(query)
    );
  }, [banners, searchQuery]);

  const handleDelete = async (id: Id<"banners">) => {
    if (deleteConfirm === id) {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b._id !== id));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] tracking-tight">
          All Banners
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Manage library banner slides</p>
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search banners..." />
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
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Preview</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Label</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Author</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Character</th>
                  <th className="text-left px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-soft)]">
                <AnimatePresence>
                  {filteredBanners.map((banner, index) => (
                    <motion.tr
                      key={banner._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-[var(--surface-light)] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        {banner.image_url ? (
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-20 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-20 h-12 bg-[var(--surface-light)] rounded-md flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-[var(--text-muted)]" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[var(--text-strong)] font-medium text-sm">{banner.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium px-2.5 py-1 rounded-full">
                          {banner.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{banner.author}</td>
                      <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{banner.character_name}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          banner.active
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-[var(--surface-light)] text-[var(--text-muted)]'
                        }`}>
                          {banner.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {deleteConfirm === banner._id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--destructive)] text-xs">Confirm?</span>
                              <button
                                onClick={() => handleDelete(banner._id)}
                                className="p-2 bg-[var(--destructive)]/20 text-[var(--destructive)] rounded-lg hover:bg-[var(--destructive)]/30 transition-colors"
                              >
                                <Check className="w-4 h-4" />
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
                                to={`/admin/banners/edit/${banner._id}`}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(banner._id)}
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

        {!isLoading && filteredBanners.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-muted)]">No banners found matching your search.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
