import { motion } from 'framer-motion';
import { BookOpen, Heart, Users, Target, PenTool, Globe, Sparkles, Quote } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const values = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Curated Stories',
    description: 'Every novel in our library is handpicked for its ability to captivate, inspire, and transport readers to extraordinary worlds.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Made with Love',
    description: 'Reading should be a joyful experience. Our platform is designed with care, passion, and attention to every detail.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community First',
    description: 'Reading is better together. We foster a community of book lovers who share recommendations, insights, and their love of stories.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Always Evolving',
    description: 'We continuously improve our platform, adding new features and stories to ensure every visit feels fresh and exciting.',
  },
];

const highlights = [
  { icon: <PenTool className="w-5 h-5" />, label: 'Handpicked Novels' },
  { icon: <Globe className="w-5 h-5" />, label: 'Read Anywhere' },
  { icon: <Sparkles className="w-5 h-5" />, label: 'Immersive Reader' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Free to Explore' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[#1a120a] to-[var(--surface-strong)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--gold)] text-sm font-medium tracking-wider uppercase">About Us</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-medium text-[var(--text-strong)] tracking-tight leading-tight mb-6">
              Where Every Story
              <span className="text-[var(--gold)]"> Finds Its Reader</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Solibu Stories is a digital library built for the love of reading. We bring you
               handpicked novels designed to make every reading moment feel
              warm, elegant, and unforgettable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[var(--color-surface)] border border-[var(--border-soft)] rounded-2xl p-5 text-center hover:border-[var(--gold)]/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] mb-3">
                  {item.icon}
                </div>
                <p className="text-[var(--text-strong)] text-sm font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-[var(--gold)] text-sm font-medium tracking-wider uppercase">Our Story</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-[var(--text-strong)] tracking-tight mb-6">
                A Story Builder's Vision
              </h2>
              <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                <p>
                  Solibu Stories is the creation of Abodunrin Ibukunoluwa, a writer who understands that stories are more than entertainment—they're connections, reflections, and moments of profound understanding.
                </p>
                <p>
                  Shaped by emotion and silence, Abodunrin writes to reach people where words usually don't go. Works like <span className="italic text-[var(--text-soft)]">Raised in Storms</span>, <span className="italic text-[var(--text-soft)]">The End of the End</span>, and the upcoming <span className="italic text-[var(--text-soft)]">Salt, Sugar, and Me</span> explore pain, growth, healing, and the search for meaning. Each story is built from emotion first, then words after.
                </p>
                <p>
                  Solibu Stories exists because Abodunrin believes readers deserve a space where they can see themselves in the narratives—not as distant observers, but as people who can point at a line and truly say, "this is me." Here, every story lingers long after the final page, sitting quietly in your thoughts until you need it most.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-soft)] bg-[var(--color-surface)]">
                <img
                  src="/images/admin.webp"
                  alt="Founder of Solibu Stories"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <p className="font-display text-xl text-white font-medium">Abodunrin Ibukunoluwa</p>
                  <p className="text-white/70 text-sm mt-1">Founder &amp; Curator of Solibu Stories</p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[var(--gold)]/20 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-[var(--gold)]/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-[var(--color-surface)] border-y border-[var(--border-soft)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Quote className="w-12 h-12 text-[var(--gold)] mx-auto mb-6 opacity-40" />
            <blockquote className="font-display text-2xl md:text-3xl italic text-[var(--text-strong)] leading-relaxed mb-6">
              "A reader lives a thousand lives before he dies. The man who never
              reads lives only one."
            </blockquote>
            <div className="w-16 h-0.5 bg-[var(--gold)] mx-auto mb-4" />
            <p className="text-[var(--gold)] font-medium">— George R.R. Martin</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-2 mb-6">
              <Target className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--gold)] text-sm font-medium tracking-wider uppercase">What Drives Us</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[var(--text-strong)] tracking-tight">
              Our Mission & Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--border-soft)] hover:border-[var(--gold)]/30 transition-all group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[var(--gold)] mb-5 group-hover:bg-[var(--gold)]/20 transition-colors">
                  {value.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--text-strong)] mb-2">
                  {value.title}
                </h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--border-soft)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-2xl md:text-3xl italic text-[var(--text-strong)] leading-relaxed mb-8">
              "Writing is not just about grammar or structure—it's about honesty. If a reader doesn't feel something, then I haven't done enough."
            </p>
            <span className="text-[var(--gold)] font-medium">— Abodunrin Ibukunoluwa, Founder of Solibu Stories</span>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
