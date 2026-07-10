import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, ImageIcon, Loader2, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { fetchBannerById, updateBanner, uploadBannerImage } from '../../data/banners';
import type { Id } from 'convex/_generated/dataModel';

interface ValidationField {
  name: string;
  label: string;
  required: boolean;
  met: boolean;
}

export default function EditBanner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [showToast, setShowToast] = useState('');

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => navigate('/admin'), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast, navigate]);
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
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      const banner = await fetchBannerById(id!);
      if (banner) {
        setFormData({
          title: banner.title,
          author: banner.author,
          label: banner.label,
          description: banner.description,
          character_name: banner.character_name,
          story: banner.story,
          active: banner.active,
          cta_type: banner.cta_type || 'coming_soon',
        });
        setImagePreview(banner.image_url);
        setExistingImageUrl(banner.image_url);
      }
      setIsLoading(false);
    };
    load();
  }, [id]);

  const hasImage = !!(imagePreview && imagePreview.length > 0);

  const requirements: ValidationField[] = [
    { name: 'title', label: 'Book Title', required: true, met: formData.title.trim().length > 0 },
    { name: 'author', label: 'Author Name', required: true, met: formData.author.trim().length > 0 },
    { name: 'label', label: 'Label', required: true, met: formData.label.trim().length > 0 },
    { name: 'description', label: 'Description', required: true, met: formData.description.trim().length > 0 },
    { name: 'character', label: 'Character Name', required: true, met: formData.character_name.trim().length > 0 },
    { name: 'story', label: 'Story Text', required: true, met: formData.story.trim().length > 0 },
    { name: 'image', label: 'Poster Image', required: true, met: hasImage },
  ];

  const allRequiredMet = requirements.filter(r => r.required).every(r => r.met);
  const missingCount = requirements.filter(r => r.required && !r.met).length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
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
    try {
      let finalImageUrl = existingImageUrl;

      if (imageFile) {
        const url = await uploadBannerImage(imageFile);
        if (!url) {
          setErrorMessage('Failed to upload image. Please try again.');
          setIsSaving(false);
          return;
        }
        finalImageUrl = url;
      }

      const result = await updateBanner(id! as Id<"banners">, {
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
        setErrorMessage('Failed to update banner.');
        setIsSaving(false);
        return;
      }

      setShowToast('Banner updated successfully!');
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

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
          Edit Banner
        </h1>
        <p className="text-[var(--text-muted)] mt-1">Update banner slide details</p>
      </div>

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
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.title.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
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
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.author.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
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
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.label.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
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
                  className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all ${
                    showErrors && !formData.character_name.trim()
                      ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                      : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                  }`}
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
                className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all resize-none ${
                  showErrors && !formData.description.trim()
                    ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                    : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                }`}
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
                className={`w-full px-4 py-3 bg-[var(--surface-light)] border rounded-xl text-[var(--text-strong)] focus:outline-none focus:ring-2 transition-all resize-none ${
                  showErrors && !formData.story.trim()
                    ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20'
                    : 'border-[var(--border-soft)] focus:border-[var(--gold)] focus:ring-[var(--gold)]/20'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                Poster Image <span className="text-[var(--destructive)]">*</span>
              </label>
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
                      onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); setExistingImageUrl(''); }}
                      className="absolute -top-2 -right-2 p-1 bg-[var(--destructive)] text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                    <p className="text-[var(--text-muted)] text-sm">Click to upload poster image</p>
                  </div>
                )}
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
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
                {isSaving ? 'Updating...' : 'Update Banner'}
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
          <p className="text-[var(--text-muted)] text-xs mb-4">Complete these to save changes</p>

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
                {req.met && <span className="text-[var(--gold)] text-xs font-medium">Done</span>}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-soft)]">
            {allRequiredMet ? (
              <div className="flex items-center gap-2 text-[var(--gold)] text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                All requirements met!
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--gold-soft)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[var(--gold-soft)] text-sm font-medium">
                    {missingCount} required {missingCount === 1 ? 'field' : 'fields'} missing
                  </p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    Fill in all required fields to save changes
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-50 bg-[#d4af37] text-[var(--color-bg)] px-6 py-3 rounded-xl shadow-2xl font-medium text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {showToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
