import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, ImageIcon, Loader2, CheckCircle2, Circle, AlertTriangle, PartyPopper } from 'lucide-react';
import { addBanner, uploadBannerImage } from '../../data/banners';

interface ValidationField {
  name: string;
  label: string;
  required: boolean;
  met: boolean;
}

export default function AddBanner() {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    label: '',
    description: '',
    character_name: '',
    story: '',
    active: true,
    cta_type: 'coming_soon',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasImage = !!(imagePreview || imageUrl);

  const requirements: ValidationField[] = [
    { name: 'title', label: 'Book Title', required: true, met: formData.title.trim().length > 0 },
    { name: 'author', label: 'Author Name', required: true, met: formData.author.trim().length > 0 },
    { name: 'label', label: 'Label (e.g. CHARACTER REVEAL)', required: true, met: formData.label.trim().length > 0 },
    { name: 'description', label: 'Description', required: true, met: formData.description.trim().length > 0 },
    { name: 'character', label: 'Character Name', required: true, met: formData.character_name.trim().length > 0 },
    { name: 'story', label: 'Story Text', required: true, met: formData.story.trim().length > 0 },
    { name: 'image', label: 'Poster Image', required: true, met: hasImage },
  ];

  const allRequiredMet = requirements.filter(r => r.required).every(r => r.met);
  const missingCount = requirements.filter(r => r.required && !r.met).length;

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => navigate('/admin'), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
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
    setUploadProgress('');
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        setUploadProgress('Uploading poster image...');
        const url = await uploadBannerImage(imageFile);
        if (!url) {
          setErrorMessage('Failed to upload image. Please try again.');
          setIsSaving(false);
          setUploadProgress('');
          return;
        }
        finalImageUrl = url;
      }

      setUploadProgress('Saving banner...');
      const result = await addBanner({
        image_url: finalImageUrl,
        label: formData.label,
        title: formData.title,
        author: formData.author,
        description: formData.description,
        character_name: formData.character_name,
        story: formData.story,
        active: formData.active,
        cta_type: formData.cta_type,
      });

      if (!result) {
        setErrorMessage('Failed to save banner.');
        setIsSaving(false);
        setUploadProgress('');
        return;
      }

      setIsSaving(false);
      setUploadProgress('');
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] tracking-tight">
          Add Banner
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Add a new library banner slide</p>
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
                  Book Title <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.title.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                  placeholder="e.g. Salt Sugar and Me"
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
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                  Label <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.label.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                  placeholder="e.g. CHARACTER REVEAL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                  Character Name <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  name="character_name"
                  value={formData.character_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.character_name.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
                  placeholder="e.g. Mr Falana"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                Description <span className="text-[var(--destructive)]">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                  showErrors && !formData.description.trim()
                    ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                    : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                }`}
                placeholder="Short description for the banner..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                Story Text <span className="text-[var(--destructive)]">*</span>
              </label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                  showErrors && !formData.story.trim()
                    ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                    : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                }`}
                placeholder="The story behind this character..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                Poster Image <span className="text-[var(--destructive)]">*</span>
              </label>

              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => { setUseUrlInput(false); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${!useUrlInput ? 'bg-[var(--gold)] text-[var(--color-bg)]' : 'bg-[var(--surface-light)] text-[var(--text-muted)]'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setUseUrlInput(true); setImageFile(null); setImagePreview(null); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${useUrlInput ? 'bg-[var(--gold)] text-[var(--color-bg)]' : 'bg-[var(--surface-light)] text-[var(--text-muted)]'}`}
                >
                  Paste URL
                </button>
              </div>

              {useUrlInput ? (
                <div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/poster.jpg"
                    className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all ${
                      showErrors && !imageUrl ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20' : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                    }`}
                  />
                  {imageUrl && (
                    <div className="mt-3 relative inline-block">
                      <img src={imageUrl} alt="Preview" className="h-36 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute -top-2 -right-2 p-1 bg-[var(--destructive)] text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    imagePreview
                      ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                      : showErrors && !hasImage
                      ? 'border-[var(--destructive)] bg-[var(--destructive)]/5'
                      : 'border-[var(--border-soft)] hover:border-[var(--gold)]/50'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="h-36 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                        className="absolute -top-2 -right-2 p-1 bg-[var(--destructive)] text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                      <p className="text-[var(--text-muted)] text-sm">Click to upload poster image</p>
                      <p className="text-[var(--text-muted)]/60 text-xs">Recommended: 1200x1600px</p>
                    </div>
                  )}
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              )}
            </div>

            <div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, active: !prev.active }))}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      formData.active ? 'bg-[var(--gold)]' : 'bg-[var(--surface-light)]'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                      formData.active ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className="text-[var(--text-soft)] text-sm">Active on library page</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Button Type</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, cta_type: 'coming_soon' }))}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    formData.cta_type === 'coming_soon'
                      ? 'bg-[#d4af37] text-[var(--color-bg)]'
                      : 'bg-[var(--surface-light)] text-[var(--text-muted)]'
                  }`}
                >
                  Coming Soon
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, cta_type: 'check_out_now' }))}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    formData.cta_type === 'check_out_now'
                      ? 'bg-[#d4af37] text-[var(--color-bg)]'
                      : 'bg-[var(--surface-light)] text-[var(--text-muted)]'
                  }`}
                >
                  Check Out Now
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-medium rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Creating...' : 'Create Banner'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/banners')}
                className="px-6 py-3 rounded-xl font-medium text-sm text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[var(--color-surface)] backdrop-blur-sm rounded-xl border border-[var(--border-soft)] p-6 h-fit sticky top-24"
        >
          <h3 className="font-display text-lg text-[var(--text-strong)] mb-1">Requirements</h3>
          <p className="text-[var(--text-muted)] text-xs mb-4">Complete these to create the banner</p>

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
                Ready to create!
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--gold-soft)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[var(--gold-soft)] text-sm font-medium">
                    {missingCount} required {missingCount === 1 ? 'field' : 'fields'} missing
                  </p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    Fill in all required fields to enable creation
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
                Your banner has been created successfully.
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
