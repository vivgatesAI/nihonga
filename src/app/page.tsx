'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY, GalleryItem } from '@/lib/gallery';

function SealMark({ char, color, size = 28 }: { char: string; color: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center border-[1.5px] rounded-[1px] shrink-0"
      style={{ width: size, height: size, borderColor: color, color, fontSize: size * 0.5, fontFamily: "'Bodoni Moda', serif", lineHeight: 1 }}
    >
      {char}
    </div>
  );
}

function StyleCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const image = item.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/[0.02]"
        style={{ boxShadow: hovered ? `0 20px 60px -15px ${item.color}30` : '0 4px 20px -8px rgba(0,0,0,0.3)' }}>
        <img
          src={image}
          alt={item.nameEn}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 transition-opacity duration-400"
          style={{ opacity: hovered ? 1 : 0, background: `linear-gradient(to top, ${item.color}cc 0%, ${item.color}60 30%, transparent 70%)` }}
        />
        {/* Hover text */}
        <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-400"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(10px)' }}
        >
          <p className="text-white/80 text-[13px] leading-relaxed line-clamp-2">{item.description}</p>
        </div>
        {/* Category badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold"
          style={{ backgroundColor: item.category === 'traditional' ? 'rgba(184,150,62,0.2)' : 'rgba(232,89,110,0.2)', color: item.category === 'traditional' ? '#b8963e' : '#e8596e', backdropFilter: 'blur(8px)' }}
        >
          {item.category}
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 flex items-start gap-2.5 px-0.5">
        <SealMark char={item.kanji[0]} color={item.color} size={24} />
        <div className="min-w-0">
          <h3 className="font-display text-[15px] leading-tight text-sumi truncate">{item.name}</h3>
          <p className="text-[11px] text-inkFaint/50 mt-0.5 truncate">{item.nameEn}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DetailView({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: 'rgba(10,8,6,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-washiDark border border-white/[0.06] rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: `0 0 80px -20px ${item.color}25` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden rounded-t-3xl">
          <img
            src={item.images[activeImg]}
            alt={item.nameEn}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-washiDark via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/60 hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <SealMark char={item.kanji[0]} color={item.color} size={36} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl sm:text-3xl leading-tight text-white">{item.name}</span>
                      <span className="text-white/50 font-display text-xl sm:text-2xl">{item.kanji}</span>
                    </div>
                    <p className="text-white/50 text-[12px] mt-0.5">{item.nameEn}</p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  {item.category === 'traditional' ? 'Classical' : 'Modern'}
                </span>
                <p className="text-white/30 text-[11px] mt-1.5">{item.period}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description + thumbnails */}
        <div className="p-5 sm:p-8">
          <p className="text-inkLight text-[15px] leading-relaxed mb-6 max-w-2xl">{item.description}</p>

          {/* Image selector thumbnails */}
          {item.images.length > 1 && (
            <div className="flex gap-3">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    idx === activeImg ? 'border-white/30 shadow-lg' : 'border-white/[0.06] opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`${item.name} variant ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NihongaGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'traditional' | 'modern'>('all');
  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredGallery = filter === 'all' ? GALLERY : GALLERY.filter(g => g.category === filter);
  const traditionalCount = GALLERY.filter(g => g.category === 'traditional').length;
  const modernCount = GALLERY.filter(g => g.category === 'modern').length;

  return (
    <div className="min-h-screen bg-washiDark text-sumi paper-texture">
      {/* Background ink washes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-64 w-[800px] h-[800px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #c23b22, transparent 70%)' }} />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #b8963e, transparent 70%)' }} />
        <div className="absolute top-1/3 left-1/4 w-[900px] h-[400px] rounded-full opacity-[0.015]" style={{ background: 'radial-gradient(ellipse, #5a6b52, transparent 70%)' }} />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 min-h-[85vh] sm:min-h-screen flex flex-col justify-center items-center text-center px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="seal stamp-in" style={{ borderColor: '#c23b22', color: '#c23b22' }}>画</div>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,9vw,6rem)] leading-[0.9] tracking-tight mb-4">
            <span className="text-vermillion">日</span>本<span className="text-vermillion">画</span>
          </h1>
          <p className="font-display text-[clamp(1rem,2.5vw,1.5rem)] text-inkLight/60 tracking-wide mb-8 max-w-md mx-auto">
            Six centuries of Japanese art<br />in one gallery
          </p>
          <p className="text-inkFaint/40 text-sm max-w-lg mx-auto leading-relaxed mb-10">
            From Edo-period woodblocks to cyberpunk neon. From Zen ink circles to chibi kawaii. Explore twelve distinct traditions — each revealing something different about the same endlessly fascinating culture.
          </p>
          <button
            onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-vermillion text-washiDark font-display text-[14px] tracking-tight rounded-xl hover:bg-vermillionDark active:scale-[0.98] transition-all duration-200"
          >
            Explore the Gallery
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </button>
        </motion.div>

        {/* Decorative seal row */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-3">
          <span className="text-inkFaint/[0.08] font-display text-4xl select-none">浮</span>
          <span className="text-inkFaint/[0.08] font-display text-4xl select-none">墨</span>
          <span className="text-inkFaint/[0.08] font-display text-4xl select-none">琳</span>
          <span className="text-inkFaint/[0.08] font-display text-4xl select-none">禅</span>
          <span className="text-inkFaint/[0.08] font-display text-4xl select-none">ア</span>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section ref={galleryRef} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="ink-divider mb-10" />

        {/* Filter tabs */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight">The Gallery</h2>
          <div className="flex-1" />
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.04]">
            {(['all', 'traditional', 'modern'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium tracking-wide uppercase transition-all duration-200 ${
                  filter === f ? 'bg-white/[0.08] text-sumi' : 'text-inkFaint/50 hover:text-inkLight'
                }`}
              >
                {f === 'all' ? `All ${GALLERY.length}` : f === 'traditional' ? `Classical ${traditionalCount}` : `Modern ${modernCount}`}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredGallery.map((item, idx) => (
            <StyleCard
              key={item.id}
              item={item}
              index={idx}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="ink-divider mb-10" />
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2">Through the Centuries</h2>
        <p className="text-inkFaint/50 text-sm mb-10">A timeline of Japanese art traditions, from temple screens to neon signs.</p>

        <div className="space-y-0">
          {GALLERY.filter(g => g.category === 'traditional').sort((a, b) => {
            const getYear = (p: string) => parseInt(p.match(/\d{4}/)?.[0] || '1400');
            return getYear(a.period) - getYear(b.period);
          }).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="flex gap-4 sm:gap-6 group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {/* Dot + line */}
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-2 transition-colors duration-300 group-hover:scale-125"
                  style={{ backgroundColor: item.color }}
                />
                <div className="w-px flex-1 bg-white/[0.06]" />
              </div>
              {/* Content */}
              <div className="pb-8">
                <p className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-1" style={{ color: item.color }}>{item.period}</p>
                <h3 className="font-display text-lg leading-tight group-hover:text-vermillion transition-colors">{item.name} <span className="text-inkFaint/30 font-display">{item.kanji}</span></h3>
                <p className="text-inkFaint/40 text-[12px] mt-1 max-w-sm">{item.nameEn}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-[11px] text-inkFaint/30">
            <div className="seal w-[18px] h-[18px] text-[8px] border opacity-30">画</div>
            <span>Nihonga Gallery</span>
            <span className="text-gold/20">·</span>
            <span>Japanese Art Engine</span>
          </div>
          <div className="text-[10px] text-inkFaint/15 tracking-[0.15em]">
            六伝統 · 一題材 · 無限美
          </div>
        </div>
      </footer>

      {/* ═══ DETAIL MODAL ═══ */}
      <AnimatePresence>
        {selectedItem && (
          <DetailView item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}