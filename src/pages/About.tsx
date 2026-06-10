import { motion } from 'framer-motion';
import { BookOpen, Heart, Users, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import StatsBar from '../components/StatsBar';

const values = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Curated Stories',
    description: 'Every novel in our library is handpicked for its ability to captivate, inspire, and transport readers to extraordinary worlds.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Made with Love',
    description: 'We believe that reading should be a joyful experience. Our platform is designed with care, passion, and attention to every detail.',
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

export default function About() {
  return (
    <div className="min-h-screen bg-[#0A0705]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-[#140E0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#C89B5A] text-sm font-medium tracking-[0.2em] uppercase">
              Our Story
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-[#FDFBF7] tracking-tight mt-4 max-w-3xl">
              Where Stories Come Alive
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl italic text-[#FDFBF7] leading-relaxed">
              "In a world of endless distractions, we believe in the magic of a good story. 
              Solibu Stories was born from a simple idea: make reading a source of daily delight."
            </blockquote>
            <div className="mt-6 w-16 h-0.5 bg-[#C89B5A] mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid md:grid-cols-2 gap-8"
          >
            <div>
              <h3 className="font-display text-xl font-semibold text-[#FDFBF7] mb-4">
                The Beginning
              </h3>
              <p className="text-[#D7C5A3] leading-relaxed">
                Solibu Stories began as a passion project by a group of book lovers who were frustrated 
                with the sterile, utilitarian reading platforms available. We wanted something different—
                a platform that celebrated the beauty of storytelling as much as the stories themselves.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-[#FDFBF7] mb-4">
                Our Mission
              </h3>
              <p className="text-[#D7C5A3] leading-relaxed">
                Today, we curate a growing library of novels across every genre imaginable. From sweeping 
                fantasies to heart-pounding thrillers, every story is chosen for its power to transport, 
                transform, and delight. We are on a mission to bring joy back to reading.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#0A0705]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-0.5 bg-[#C89B5A] mb-4 mx-auto"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-medium text-[#FDFBF7] tracking-tight text-center mb-12"
          >
            What We Stand For
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2A1F0E] text-[#C89B5A] mb-5 border border-[#C89B5A]/20">
                  {value.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-[#FDFBF7] mb-2">
                  {value.title}
                </h3>
                <p className="text-[#D7C5A3] text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* <StatsBar /> */}

      {/* Mission Statement */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-2xl md:text-3xl italic text-[#FDFBF7] leading-relaxed">
              "We don't just publish stories. We create experiences that linger in your 
              heart long after you've turned the final page."
            </p>
            <div className="mt-8">
              <span className="text-[#C89B5A] font-medium">— The Solibu Stories Team</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
