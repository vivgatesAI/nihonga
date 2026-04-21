'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STYLES } from '@/lib/styles';

interface GeneratedImage { style: string; url: string; prompt: string; }

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const itemAnim = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

export default function NihongaApp() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['ukiyoe', 'sumie', 'rinpa']);
  const [subject, setSubject] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<GeneratedImage | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const generate = useCallback(async () => {
    if (selectedStyles.length === 0) { setError('Select at least one tradition'); return; }
    if (!subject.trim()) { setError('Describe your subject'); return; }
    setError(null);
    setIsGenerating(true);
    setImages([]);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styles: selectedStyles, subject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Generation failed');
      setImages(data.images || []);
      setHasGenerated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedStyles, subject]);

  const getStyleById = (id: string) => STYLES.find(s => s.id === id);

  return (
    <div className="min-h-screen bg-washiDark text-sumi paper-texture">
      {/* ──── BACKGROUND INK WASH ──── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Top-right vermillion splash */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-vermillion/[0.02] blur-[120px]" />
        {/* Bottom-left gold glow */}
        <div className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full bg-gold/[0.015] blur-[150px]" />
        {/* Center ink pool */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-inkFaint/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* ──── HEADER ──── */}
      <header className="relative z-20 sticky top-0 backdrop-blur-xl bg-washiDark/70 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="seal stamp-in scale-[0.85]">画</div>
            <div>
              <div className="font-display text-[15px] tracking-tight leading-none">
                <span className="text-vermillion">日</span>本<span className="text-vermillion">画</span>
              </div>
              <div className="text-[9px] text-inkFaint tracking-[0.2em] uppercase mt-0.5">Style Engine</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[11px] text-inkFaint">
            <span>Ukiyo-e</span>
            <span className="text-gold/30">·</span>
            <span>Sumi-e</span>
            <span className="text-gold/30">·</span>
            <span>Rinpa</span>
            <span className="text-gold/30">·</span>
            <span>Kano</span>
            <span className="text-gold/30">·</span>
            <span>Shin-hanga</span>
            <span className="text-gold/30">·</span>
            <span>Ensō</span>
          </div>
        </div>
      </header>

      {/* ──── HERO ──── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-24 pb-10 sm:pb-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[10px] font-semibold text-vermillion uppercase tracking-[0.25em] mb-5"
          >
            Japanese Art Collage Generator
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[0.95] tracking-tight mb-6"
          >
            One scene.<br />
            <span className="text-vermillion">Six centuries</span><br />
            of art.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-inkLight text-base sm:text-lg leading-relaxed max-w-lg"
          >
            Describe a scene — a garden at dawn, a storm over the bay, a face in lamplight — and watch it transformed across Ukiyo-e woodblocks, Sumi-e ink wash, Rinpa gold leaf, and more.
          </motion.p>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8"><div className="ink-divider" /></div>

      {/* ──── COMPOSER ──── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Subject */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="text-[10px] font-semibold text-gold uppercase tracking-[0.2em] mb-3 block">
            Describe your scene
          </label>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-5 text-[15px] text-sumi placeholder:text-inkFaint/60 focus:outline-none focus:border-vermillion/40 focus:ring-4 focus:ring-vermillion/10 resize-none transition-all duration-300 backdrop-blur-sm"
            placeholder="A woman in a kimono walking through bamboo in a sudden downpour, mist hanging low between the stalks…"
          />
          <div className="flex justify-between mt-1.5 px-1">
            <p className="text-[10px] text-inkFaint/40">Be vivid — include mood, season, light</p>
            <p className="text-[10px] text-inkFaint/30">{subject.length}/7500</p>
          </div>
        </motion.div>

        {/* Style selector */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <div className="flex items-baseline justify-between mb-4">
            <label className="text-[10px] font-semibold text-gold uppercase tracking-[0.2em]">
              Traditions
            </label>
            <span className="text-[11px] text-inkFaint/50">
              {selectedStyles.length} selected
            </span>
          </div>

          <motion.div variants={stagger} initial="initial" animate="animate"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {STYLES.map(style => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <motion.button
                  key={style.id}
                  variants={itemAnim}
                  onClick={() => toggleStyle(style.id)}
                  className={`relative text-left rounded-2xl transition-all duration-400 overflow-hidden ${
                    isSelected
                      ? 'bg-white/[0.06] border border-vermillion/30 shadow-[0_0_30px_-8px_rgba(194,59,34,0.15)]'
                      : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1]'
                  }`}
                >
                  {/* Top area with kanji */}
                  <div className="px-4 pt-5 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-display text-[22px] leading-none text-sumi">{style.name}</div>
                        <div className="text-[11px] text-inkLight/70 mt-1.5 leading-snug">{style.nameEn}</div>
                      </div>
                      <div className={`seal scale-[0.7] transition-all duration-400 ${
                        isSelected ? 'opacity-100' : 'opacity-[0.12]'
                      }`}>
                        {style.seal}
                      </div>
                    </div>
                  </div>

                  {/* Period + description */}
                  <div className="px-4 pb-5">
                    <div className="text-[9px] text-inkFaint/40 tracking-wider uppercase">{style.period}</div>
                    {isSelected && (
                      <p className="text-[11px] text-inkLight/50 mt-2 leading-relaxed">{style.description}</p>
                    )}
                  </div>

                  {/* Selection indicator line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-vermillion/80 via-vermillion to-vermillion/80 transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0'
                  }`} />
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Generate */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <button
            onClick={generate}
            disabled={isGenerating || selectedStyles.length === 0 || !subject.trim()}
            className="group relative overflow-hidden px-10 py-4.5 bg-vermillion text-washi rounded-2xl font-display text-[15px] tracking-tight hover:bg-vermillionDark active:scale-[0.98] transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.3"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Painting…
                </>
              ) : (
                <>Generate {selectedStyles.length} Style{selectedStyles.length !== 1 ? 's' : ''}</>
              )}
            </span>
            {/* Shimmer overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          {hasGenerated && !isGenerating && (
            <button
              onClick={generate}
              className="text-[12px] text-inkFaint hover:text-sumi transition-colors flex items-center gap-1.5 group"
            >
              <svg className="group-hover:rotate-180 transition-transform duration-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/>
                <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>
              </svg>
              Regenerate
            </button>
          )}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mt-5 p-4 rounded-2xl bg-vermillion/10 border border-vermillion/20 text-vermillion text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ──── GENERATING STATE ──── */}
      {isGenerating && (
        <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-16">
          <div className="ink-divider mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {selectedStyles.map((id, idx) => {
              const style = getStyleById(id);
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="aspect-square rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center justify-center gap-3"
                >
                  <div className="text-5xl font-display text-white/[0.06] breathe select-none">{style?.seal}</div>
                  <div className="text-[11px] text-inkFaint/30 flex items-center gap-1.5">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Painting…
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ──── RESULTS ──── */}
      {images.length > 0 && !isGenerating && (
        <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-20">
          <div className="ink-divider mb-10" />

          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-semibold text-gold uppercase tracking-[0.2em] mb-2">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl tracking-tight leading-tight">
                {subject.split(',')[0].slice(0, 50)}{subject.length > 50 ? '…' : ''}
              </h2>
              <p className="text-[12px] text-inkFaint/50 mt-1">
                {images.length} {images.length === 1 ? 'rendering' : 'renderings'}
              </p>
            </div>
            <div className="seal scale-[0.7] opacity-50">画</div>
          </div>

          {/* Gallery grid */}
          <div className={`grid gap-4 ${
            images.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' :
            images.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' :
            images.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto' :
            'grid-cols-2 sm:grid-cols-3'
          }`}>
            {images.map((img, idx) => {
              const style = getStyleById(img.style);
              if (!style) return null;
              return (
                <motion.div
                  key={img.style}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <button
                    onClick={() => img.url ? setExpandedImage(img) : null}
                    className={`block w-full rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.5)] ${
                      img.url ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {img.url ? (
                      <div className="aspect-square relative overflow-hidden bg-white/[0.02]">
                        <img
                          src={img.url}
                          alt={`${style.nameEn} rendering`}
                          className="w-full h-full object-cover image-reveal group-hover:scale-[1.04] transition-transform duration-700"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                          <div className="flex items-center gap-2">
                            <div className="seal w-[20px] h-[20px] text-[9px] border-[1.5px] stamp-in">{style.seal}</div>
                            <span className="font-display text-[13px] text-white/90">{style.nameEn}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square bg-white/[0.02] flex items-center justify-center">
                        <span className="text-6xl font-display text-white/[0.04] select-none">{style.seal}</span>
                      </div>
                    )}
                  </button>

                  {/* Label below image */}
                  <div className="mt-3 px-0.5 flex items-center gap-2.5">
                    <div className="seal w-[20px] h-[20px] text-[9px] border-[1.5px] opacity-60">{style.seal}</div>
                    <div>
                      <div className="font-display text-[14px] leading-tight">{style.nameEn}</div>
                      <div className="text-[10px] text-inkFaint/40">{style.name}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ──── EMPTY STATE ──── */}
      {images.length === 0 && !isGenerating && (
        <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-24">
          <div className="ink-divider my-12" />
          <div className="text-center py-8">
            <div className="text-[120px] sm:text-[160px] font-display text-white/[0.02] leading-none select-none mb-2">画</div>
            <p className="text-inkFaint/30 text-sm">Describe a subject, select traditions, and generate.</p>
          </div>
        </section>
      )}

      {/* ──── EXPANDED IMAGE MODAL ──── */}
      <AnimatePresence>
        {expandedImage && (() => {
          const style = getStyleById(expandedImage.style);
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              onClick={() => setExpandedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-washiDark border border-white/[0.06] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="seal w-[26px] h-[26px] text-[12px] border-[1.5px]">{style?.seal}</div>
                    <div>
                      <div className="font-display text-lg sm:text-xl leading-tight">{style?.name} — {style?.nameEn}</div>
                      <div className="text-[11px] text-inkFaint">{style?.period}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {expandedImage.url && (
                      <a href={expandedImage.url} download={`nihonga-${expandedImage.style}.png`}
                        target="_blank" rel="noopener"
                        className="p-2.5 rounded-xl hover:bg-white/[0.06] text-inkFaint hover:text-sumi transition-colors"
                        title="Download image"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </a>
                    )}
                    <button onClick={() => setExpandedImage(null)}
                      className="p-2.5 rounded-xl hover:bg-white/[0.06] text-inkFaint hover:text-sumi transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div className="p-3 sm:p-5">
                  {expandedImage.url ? (
                    <img src={expandedImage.url} alt={style?.nameEn}
                      className="w-full max-h-[65vh] object-contain rounded-2xl"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-white/[0.02] rounded-2xl flex items-center justify-center">
                      <span className="text-8xl font-display text-white/[0.03]">{style?.seal}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <p className="text-[13px] text-inkLight leading-relaxed">{style?.description}</p>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ──── FOOTER ──── */}
      <footer className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-[11px] text-inkFaint/30">
            <div className="seal w-[18px] h-[18px] text-[8px] border opacity-30">画</div>
            <span>Nihonga Style Engine</span>
            <span className="text-gold/20">·</span>
            <span className="hidden sm:inline">Venice AI · Flux 2 Max</span>
          </div>
          <div className="text-[10px] text-inkFaint/15 tracking-[0.15em]">
            六伝統 · 一題材 · 無限美
          </div>
        </div>
      </footer>
    </div>
  );
}