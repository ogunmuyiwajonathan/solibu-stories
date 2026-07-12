import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, ImageIcon, Loader2, CheckCircle2, Circle, AlertTriangle, PartyPopper, Link } from 'lucide-react';
import { addBook, uploadCover } from '../../data/books';
import StarRating from '../../components/StarRating';

interface ValidationField {
  name: string;
  label: string;
  required: boolean;
  met: boolean;
}

export default function AddNovel() {
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    synopsis: '',
    rating: 4.0,
    featured: false,
    reading_time: '',
    chapters: '',
    pdf_url: '',
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const requirements: ValidationField[] = [
    { name: 'title', label: 'Book Title', required: true, met: formData.title.trim().length > 0 },
    { name: 'author', label: 'Author Name', required: true, met: formData.author.trim().length > 0 },
    { name: 'synopsis', label: 'Synopsis', required: true, met: formData.synopsis.trim().length > 0 },
    { name: 'cover', label: 'Cover Image', required: true, met: coverFile !== null },
    { name: 'pdf', label: 'Buy Link', required: true, met: formData.pdf_url.trim().length > 0 },
  ];

  const allRequiredMet = requirements.filter(r => r.required).every(r => r.met);
  const missingCount = requirements.filter(r => r.required && !r.met).length;

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => navigate('/admin'), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequiredMet) {
      setShowErrors(true);
      return;
    }
    setIsSaving(true);
    setErrorMessage('');
    try {
      let coverUrl = '';

      if (coverFile) {
        setUploadProgress('Uploading cover image...');
        const url = await uploadCover(coverFile);
        if (!url) {
          setErrorMessage('Failed to upload cover image. Please try again.');
          setIsSaving(false);
          setUploadProgress('');
          return;
        }
        coverUrl = url;
      } else if (!coverPreview) {
        setErrorMessage('Cover image is required.');
        setIsSaving(false);
        setUploadProgress('');
        return;
      }

      setUploadProgress('Saving book...');
      const sessionToken = localStorage.getItem('admin_session_token') || '';
      const result = await addBook({
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        synopsis: formData.synopsis,
        cover_url: coverUrl,
        pdf_url: formData.pdf_url,
        rating: formData.rating,
        featured: formData.featured,
        reading_time: formData.reading_time || undefined,
        chapters: formData.chapters ? Number(formData.chapters) : undefined,
      }, sessionToken);
 
       if (!result) {
        setErrorMessage('Failed to save book. The database may have rejected the data.');
        setIsSaving(false);
        setUploadProgress('');
        return;
      }

      setIsSaving(false);
      setUploadProgress('');
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setUploadProgress('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] tracking-tight">
          Add Novel
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Add a new story to your collection</p>
      </div>

      {isSaving && uploadProgress && (
        <div className="mb-6 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-[var(--gold)] animate-spin" />
          <span className="text-[var(--gold)] text-sm font-medium">{uploadProgress}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--destructive)] flex-shrink-0" />
          <span className="text-[var(--destructive)] text-sm font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="ml-auto p-1 text-[var(--destructive)]/70 hover:text-[var(--destructive)]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-[var(--color-surface)] backdrop-blur-sm rounded-xl border border-[var(--border-soft)] p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                  Title <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.title.trim()
                      ? 'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                  placeholder="Novel title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                  Author <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.author.trim()
                      ? 'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Rating</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 5) {
                        setFormData((prev) => ({ ...prev, rating: val }));
                      }
                    }}
                    className="w-24 px-3 py-2 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] text-center focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                  />
                  <StarRating rating={formData.rating} size="md" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                  Reading Time <span className="text-[var(--text-muted)] text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  name="reading_time"
                  value={formData.reading_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:border-[var(--gold)] focus:ring-[var(--gold)]/20 transition-all"
                  placeholder="e.g. ~6 hours read"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                  Chapters <span className="text-[var(--text-muted)] text-xs">(optional)</span>
                </label>
                <input
                  type="number"
                  name="chapters"
                  value={formData.chapters}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:border-[var(--gold)] focus:ring-[var(--gold)]/20 transition-all"
                  placeholder="e.g. 12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                Synopsis <span className="text-[var(--destructive)]">*</span>
              </label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                  showErrors && !formData.synopsis.trim()
                    ? 'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                    : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                }`}
                placeholder="Write a compelling synopsis..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                Cover Image <span className="text-[var(--destructive)]">*</span>
              </label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  coverPreview
                    ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                    : showErrors && !coverFile
                    ? 'border-[var(--destructive)] bg-[var(--destructive)]/5'
                    : 'border-[var(--border-soft)] hover:border-[var(--gold)]/50'
                }`}
              >
                {coverPreview ? (
                  <div className="relative inline-block">
                    <img src={coverPreview} alt="Cover preview" className="h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCoverPreview(null); setCoverFile(null); }}
                      className="absolute -top-2 -right-2 p-1 bg-[var(--destructive)] text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                    <p className="text-[var(--text-muted)] text-sm">Click to upload cover image</p>
                    <p className="text-[var(--text-muted)]/60 text-xs">Recommended: 400x600px</p>
                  </div>
                )}
                <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                Buy Link <span className="text-[var(--destructive)]">*</span>
              </label>
              <div className="relative">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="url"
                  name="pdf_url"
                  value={formData.pdf_url}
                  onChange={handleChange}
                  placeholder="Paste the website link where users can buy/read this story"
                  className={`w-full pl-11 pr-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.pdf_url.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                />
              </div>
              <p className="text-[var(--text-muted)]/60 text-xs mt-1.5">Users will be redirected to this link to buy or read the story</p>
            </div>

            <div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, featured: !prev.featured }))}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      formData.featured ? 'bg-[var(--gold)]' : 'bg-[var(--surface-light)]'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                      formData.featured ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className="text-[var(--text-soft)] text-sm">Featured on homepage</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-medium rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Publishing...' : 'Publish Novel'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/novels')}
                className="px-6 py-3 rounded-xl font-medium text-sm text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>

        {/* Requirements Checklist */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[var(--color-surface)] backdrop-blur-sm rounded-xl border border-[var(--border-soft)] p-6 h-fit sticky top-24"
        >
          <h3 className="font-display text-lg text-[var(--text-strong)] mb-1">Requirements</h3>
          <p className="text-[var(--text-muted)] text-xs mb-4">Complete these to publish your book</p>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.name} className="flex items-center gap-3">
                {req.met ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--gold)] flex-shrink-0" />
                ) : (
                  <Circle className={`w-5 h-5 flex-shrink-0 ${req.required ? 'text-[var(--text-muted)]' : 'text-[var(--surface-light)]'}`} />
                )}
                <div className="flex-1">
                  <span className={`text-sm ${req.met ? 'text-[var(--gold)]' : 'text-[var(--text-soft)]/70'}`}>
                    {req.label}
                  </span>
                  {!req.required && (
                    <span className="text-[var(--text-muted)] text-xs ml-1">(optional)</span>
                  )}
                </div>
                {req.met && (
                  <span className="text-[var(--gold)] text-xs font-medium">Done</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-soft)]">
            {allRequiredMet ? (
              <div className="flex items-center gap-2 text-[var(--gold)] text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Ready to publish!
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--gold-soft)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[var(--gold-soft)] text-sm font-medium">
                    {missingCount} required {missingCount === 1 ? 'field' : 'fields'} missing
                  </p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    Fill in all required fields to enable publishing
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--border-soft)] p-10 text-center max-w-md mx-4 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--gold)]/10 border-2 border-[var(--gold)]/30 flex items-center justify-center"
              >
                <PartyPopper className="w-10 h-10 text-[var(--gold)]" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-2xl font-bold text-[var(--text-strong)] mb-2"
              >
                Congratulations!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[var(--text-muted)] mb-2"
              >
                Your novel has been published successfully.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-[var(--text-muted)] text-sm mb-8"
              >
                Redirecting to dashboard in 4 seconds...
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-medium rounded-xl transition-colors"
              >
                Back to Dashboard
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
