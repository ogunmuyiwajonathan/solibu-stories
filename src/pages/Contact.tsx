import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Send, CheckCircle, MessageSquare, ArrowRight, Clock, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'abodunrinoluwanifemi116@gmail.com',
      description: 'We reply within 24 hours',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '09047651145',
      description: 'Mon - Fri, 9am to 6pm',
    },
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: '+234 904 765 1145',
      description: 'Chat with us',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: '19 Babatunde Odusiji Street',
      description: 'Sango Ota, Ogun State, Nigeria',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[50vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[#1a120a] to-[var(--surface-strong)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80')] bg-cover bg-center opacity-15" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-2 mb-6">
              <MessageSquare className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--gold)] text-sm font-medium tracking-wider uppercase">Get in Touch</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-medium text-[var(--text-strong)] tracking-tight leading-tight mb-6">
              We'd Love to<br />Hear From You
            </h1>

            <p className="text-[var(--text-muted)] text-lg md:text-xl leading-relaxed max-w-xl">
              Have a question, suggestion, or just want to say hello? Drop us a message
              and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h2 className="font-display text-2xl font-medium text-[var(--text-strong)] mb-3">
                  Let's Start a Conversation
                </h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Whether you have a story to share, a question about our platform,
                  or partnership inquiries — we're all ears.
                </p>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <motion.div
                    key={method.label}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--border-soft)] hover:border-[var(--gold)]/30 transition-all cursor-default group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gold)]/20 transition-colors">
                      {method.icon === 'whatsapp' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--gold)]">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      ) : (
                        <method.icon className="w-5 h-5 text-[var(--gold)]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[var(--text-strong)] font-medium text-sm">{method.label}</p>
                      <p className="text-[var(--gold)] text-sm mt-0.5">{method.value}</p>
                      <p className="text-[var(--text-muted)] text-xs mt-1">{method.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--border-soft)]">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-[var(--gold)]" />
                  <span className="text-[var(--text-strong)] font-medium text-sm">Office Hours</span>
                </div>
                <div className="space-y-1.5 text-sm text-[var(--text-muted)]">
                  <p>Monday — Friday: <span className="text-[var(--text-soft)]">9:00 AM — 6:00 PM</span></p>
                  <p>Saturday: <span className="text-[var(--text-soft)]">10:00 AM — 4:00 PM</span></p>
                  <p>Sunday: <span className="text-[var(--text-soft)]">Closed</span></p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[var(--gold)]/5 border border-[var(--gold)]/20">
                <blockquote className="font-display text-sm italic leading-relaxed text-[var(--text-soft)] mb-2">
                  "A reader lives a thousand lives before he dies. The man who never
                  reads lives only one."
                </blockquote>
                <p className="text-[var(--gold)] text-xs font-medium">— George R.R. Martin</p>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[var(--color-surface)] rounded-2xl p-10 md:p-12 border border-[var(--border-soft)] text-center flex flex-col items-center justify-center min-h-[500px]"
                  >
                    <div className="w-20 h-20 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-[var(--gold)]" />
                    </div>
                    <h3 className="font-display text-3xl font-medium text-[var(--text-strong)] mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-[var(--text-muted)] max-w-sm">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-[var(--color-surface)] rounded-2xl p-8 md:p-10 border border-[var(--border-soft)]"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-11 h-11 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center">
                        <Send className="w-5 h-5 text-[var(--gold)]" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-medium text-[var(--text-strong)]">Send a Message</h3>
                        <p className="text-[var(--text-muted)] text-sm">We'll respond as soon as possible</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                            Your Name <span className="text-[var(--destructive)]">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                            Email Address <span className="text-[var(--destructive)]">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className="w-full px-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                          Subject <span className="text-[var(--text-muted)] text-xs">(optional)</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-[var(--text-soft)] mb-2">
                          Message <span className="text-[var(--destructive)]">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Tell us what's on your mind..."
                          className="w-full px-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-semibold rounded-xl shadow-lg shadow-[var(--gold)]/20 transition-all hover:shadow-xl hover:shadow-[var(--gold)]/30"
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
