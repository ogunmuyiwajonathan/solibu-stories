import { motion } from 'framer-motion';

interface Book3DProps {
  coverUrl: string;
  title: string;
  author: string;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

export default function Book3D({ coverUrl, title, author, rotation = -18, className = '', onClick }: Book3DProps) {
  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: '1200px' }}
      onClick={onClick}
    >
      <motion.div
        whileHover={{ scale: 1.03, rotateY: rotation + 5 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg) rotateX(2deg)`,
        }}
      >
        {/* Shadow */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-12 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)',
            filter: 'blur(12px)',
            transform: 'translateZ(-20px) rotateX(80deg)',
          }}
        />

        {/* Book body */}
        <div
          className="relative w-48 h-72 sm:w-56 sm:h-80 md:w-64 md:h-[380px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Pages edge (right side) */}
          <div
            className="absolute inset-y-[6px] right-0 w-3 md:w-4 rounded-r-sm"
            style={{
              background: 'linear-gradient(90deg, #f0e8d8 0%, #faf6ee 20%, #f5f0e6 40%, #ede4d2 60%, #e8dcc8 80%, #dfd2bc 100%)',
              transform: 'rotateY(90deg) translateZ(-2px)',
              transformOrigin: 'right',
              boxShadow: 'inset -1px 0 3px rgba(0,0,0,0.08), inset 2px 0 6px rgba(0,0,0,0.05)',
            }}
          >
            {/* Page lines */}
            <div className="absolute inset-0 overflow-hidden opacity-40">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="h-px mx-1"
                  style={{
                    background: i % 5 === 0 ? 'rgba(180,165,140,0.6)' : 'rgba(200,185,160,0.3)',
                    marginTop: i === 0 ? '2px' : '8.5px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Pages edge (bottom) */}
          <div
            className="absolute bottom-0 inset-x-[3px] h-3 md:h-4 rounded-b-sm"
            style={{
              background: 'linear-gradient(180deg, #f0e8d8 0%, #ede4d2 50%, #e8dcc8 100%)',
              transform: 'rotateX(-90deg) translateZ(-2px)',
              transformOrigin: 'bottom',
              boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.06)',
            }}
          />

          {/* Spine */}
          <div
            className="absolute inset-y-0 left-0 w-6 md:w-8 rounded-l-md overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #1a120a 0%, #2a1f14 30%, #1e160e 60%, #151008 100%)',
              transform: 'rotateY(-90deg) translateZ(0)',
              transformOrigin: 'left',
              boxShadow: 'inset -2px 0 8px rgba(0,0,0,0.5), 2px 0 4px rgba(0,0,0,0.3)',
            }}
          >
            {/* Spine decoration lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent mt-3" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent mb-3" />

            {/* Spine text */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              <span className="text-[var(--gold)]/70 text-[9px] md:text-[11px] font-display tracking-widest uppercase truncate px-1">
                {title}
              </span>
            </div>
          </div>

          {/* Front cover */}
          <div
            className="absolute inset-0 rounded-r-lg overflow-hidden"
            style={{
              transform: 'translateZ(6px)',
              boxShadow: '6px 6px 24px rgba(0,0,0,0.35), 2px 2px 8px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Top gloss */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent pointer-events-none" />
            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight mb-1 drop-shadow-lg">
                {title}
              </h3>
              <p className="text-white/60 text-xs md:text-sm font-medium">
                {author}
              </p>
            </div>
          </div>

          {/* Back cover (hidden, gives thickness) */}
          <div
            className="absolute inset-0 rounded-r-lg"
            style={{
              background: '#1a120a',
              transform: 'translateZ(-6px)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
