import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight, Heart, Instagram, Facebook, Youtube } from 'lucide-react';

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
              <img
                src="/images/logo.webp"
                alt="Solibu Stories"
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
              <span className="font-display text-2xl font-semibold text-[var(--text-strong)]">
                Solibu Stories
              </span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-xs">
              A curated library of captivating stories designed to make every reading moment feel warm, elegant, and unforgettable.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/2349047651145' },
                { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/solibu_writes?igsh=MTJvZXdqMWEwdWJoeQ%3D%3D&utm_source=qr' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@theabodunrins' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-[var(--surface-light)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 transition-all"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon === 'whatsapp' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  ) : (
                    <social.icon className="w-4 h-4" />
                  )}
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
                <a href="mailto:abodunrinoluwanifemi116@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gold)]/20 transition-colors">
                    <Mail className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-soft)] text-sm group-hover:text-[var(--gold)] transition-colors">abodunrinoluwanifemi116@gmail.com</p>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">Email us anytime</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+2349047651145" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gold)]/20 transition-colors">
                    <Phone className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-soft)] text-sm group-hover:text-[var(--gold)] transition-colors">09047651145</p>
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
                    <p className="text-[var(--text-soft)] text-sm">19 babatunde odusiji street</p>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">sango ota, Ogun state, Nigeria</p>
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
