import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Save, X, ImageIcon, Loader2, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { genres, addBook, uploadCover, uploadPdf } from '../../data/books';
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
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    synopsis: '',
    rating: 4.0,
    featured: false,
    order_index: 1,
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const requirements: ValidationField[] = [
    { name: 'title', label: 'Book Title', required: true, met: formData.title.trim().length > 0 },
    { name: 'author', label: 'Author Name', required: true, met: formData.author.trim().length > 0 },
    { name: 'genre', label: 'Genre', required: true, met: formData.genre.length > 0 },
    { name: 'synopsis', label: 'Synopsis', required: true, met: formData.synopsis.trim().length > 0 },
    { name: 'cover', label: 'Cover Image', required: true, met: coverFile !== null },
    { name: 'pdf', label: 'PDF File', required: false, met: pdfFile !== null },
  ];

  const allRequiredMet = requirements.filter(r => r.required).every(r => r.met);
  const missingCount = requirements.filter(r => r.required && !r.met).length;

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

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
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
      let pdfUrl = '';

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

      if (pdfFile) {
        setUploadProgress('Uploading PDF file...');
        const url = await uploadPdf(pdfFile);
        if (!url) {
          setErrorMessage('Failed to upload PDF. Please try again.');
          setIsSaving(false);
          setUploadProgress('');
          return;
        }
        pdfUrl = url;
      }

      setUploadProgress('Saving book...');
      const result = await addBook({
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        synopsis: formData.synopsis,
        cover_url: coverUrl,
        pdf_url: pdfUrl,
        rating: formData.rating,
        featured: formData.featured,
        order_index: formData.order_index,
      });

      if (!result) {
        setErrorMessage('Failed to save book. The database may have rejected the data.');
        setIsSaving(false);
        setUploadProgress('');
        return;
      }

      navigate('/admin/novels');
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
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                  Genre <span className="text-[var(--destructive)]">*</span>
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.genre
                      ? 'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                >
                  <option value="">Select a genre</option>
                  {genres.filter(g => g !== 'All').map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Rating</label>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={formData.rating}
                    size="md"
                    interactive
                    onChange={(r) => setFormData((prev) => ({ ...prev, rating: r }))}
                  />
                  <span className="text-[var(--text-strong)] font-medium">{formData.rating.toFixed(1)}</span>
                </div>
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
                PDF File <span className="text-[var(--text-muted)] text-xs">(optional)</span>
              </label>
              <div
                onClick={() => pdfInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  pdfFileName
                    ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                    : 'border-[var(--border-soft)] hover:border-[var(--gold)]/50'
                }`}
              >
                {pdfFileName ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-6 h-6 text-[var(--gold)]" />
                    <span className="text-[var(--text-strong)] text-sm">{pdfFileName}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPdfFileName(null); setPdfFile(null); }}
                      className="p-1 text-[var(--destructive)] hover:text-[var(--destructive)]/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                    <p className="text-[var(--text-muted)] text-sm">Click to upload PDF</p>
                    <p className="text-[var(--text-muted)]/60 text-xs">Users can read this as an interactive book</p>
                  </div>
                )}
                <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Display Order</label>
                <input
                  type="number"
                  name="order_index"
                  value={formData.order_index}
                  onChange={handleChange}
                  min={1}
                  className="w-full px-4 py-3 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                />
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
    </div>
  );
}
