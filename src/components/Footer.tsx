import { Link } from 'react-router-dom';
import { BookOpen, Mail, MapPin, Phone, ArrowRight, Heart, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { to: '/', label: 'Home' },
        { to: '/library', label: 'Library' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Genres',
      links: [
        { to: '/library?genre=Fiction', label: 'Fiction' },
        { to: '/library?genre=Romance', label: 'Romance' },
        { to: '/library?genre=Thriller', label: 'Thriller' },
        { to: '/library?genre=Sci-Fi', label: 'Sci-Fi' },
      ],
    },
  ];

  return (
    <footer className="bg-[var(--surface-strong)] border-t border-[var(--border-soft)]">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[var(--gold)]/5 via-[var(--gold)]/10 to-[var(--gold)]/5 border-b border-[var(--border-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-medium text-[var(--text-strong)] mb-2">
                Stay Updated
              </h3>
              <p className="text-[var(--text-muted)] text-sm">
                Get the latest stories and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-5 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-l-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
              />
              <Link to="signin" className="px-6 py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-semibold rounded-r-xl transition-all flex items-center gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20">
                <BookOpen className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <span className="font-display text-2xl font-semibold text-[var(--text-strong)]">
                Solibu Stories
              </span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-xs">
              A curated library of captivating stories designed to make every reading moment feel warm, elegant, and unforgettable.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-[var(--surface-light)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-display text-lg font-medium text-[var(--text-strong)] mb-6">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/0 group-hover:bg-[var(--gold)] transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 className="font-display text-lg font-medium text-[var(--text-strong)] mb-6">
              Contact Us
            </h4>
            <ul className="space-y-5">
              <li>
                <a href="mailto:hello@solibustories.com" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gold)]/20 transition-colors">
                    <Mail className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-soft)] text-sm group-hover:text-[var(--gold)] transition-colors">hello@solibustories.com</p>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">Email us anytime</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gold)]/20 transition-colors">
                    <Phone className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-soft)] text-sm group-hover:text-[var(--gold)] transition-colors">+1 (555) 123-4567</p>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">Mon-Fri, 9am-6pm</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-soft)] text-sm">123 Story Lane</p>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">Literary District, NY 10001</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--text-muted)] text-sm">
              © {currentYear} Solibu Stories. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
              <span>for readers everywhere</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--gold)] text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--gold)] text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
