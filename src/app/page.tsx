'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STYLES } from '@/lib/styles';

interface GeneratedImage {
  style: string;
  url: string;
  prompt: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export default function NihongaApp() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['ukiyoe', 'sumie', 'rinpa']);
  const [subject, setSubject] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<GeneratedImage | null>(null);
  const [showAllStyles, setShowAllStyles] = useState(false);

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const generate = useCallback(async () => {
    if (selectedStyles.length === 0) { setError('Select at least one style'); return; }
    if (!subject.trim()) { setError('Describe your subject first'); return; }
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedStyles, subject]);

  const getStyleById = (id: string) => STYLES.find(s => s.id === id);

  const visibleStyles = showAllStyles ? STYLES : STYLES;

  return (
    <div className="min-h-screen bg-washi text-sumi selection:bg-vermillion/20">
      {/* ─── HEADER ──── */}
      <header className="sticky top-0 z-40 bg-washi/80 backdrop-blur-xl border-b border-kozo/60">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="seal stamp-in">画</div>
            <div>
              <h1 className="font-display text-[17px] leading-none tracking-tight">
                <span className="text-vermillion">日</span>本<span className="text-vermillion">画</span>
              </h1>
              <div className="text-[10px] text-inkLight/50 tracking-widest uppercase mt-0.5">Style Engine</div>
            </div>
          </div>
          <div className="text-[11px] text-inkLight/40 hidden sm:block">
            One subject · Six traditions · Infinite beauty
          </div>
        </div>
      </header>

      {/* ──── HERO ──── */}
      <section className="max-w-6xl mx-auto px-5 pt-10 pb-6 sm:pt-16 sm:pb-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium text-vermillion/70 uppercase tracking-[0.2em] mb-3">
            Japanese Art Collage Generator
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] tracking-tight mb-4">
            One scene rendered through<br />
            <span className="text-vermillion">six centuries</span> of art.
          </h2>
          <p className="text-inkLight text-base sm:text-lg leading-relaxed max-w-lg">
            Describe a scene — a garden, a storm, a face — and watch it transformed through Ukiyo-e woodblocks, Sumi-e ink wash, Rinpa gold leaf, and more.
          </p>
        </div>
      </section>

      <div className="gold-divider max-w-6xl mx-auto" />

      {/* ──── COMPOSER ──── */}
      <section className="max-w-6xl mx-auto px-5 py-8 sm:py-12">
        {/* Subject input */}
        <div className="mb-8">
          <label className="text-[10px] font-semibold text-inkLight/50 uppercase tracking-[0.18em] mb-2 block">
            Subject
          </label>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            rows={2}
            className="w-full bg-white border border-kozo/80 rounded-2xl px-5 py-4 text-[15px] text-sumi placeholder:text-inkLight/30 focus:outline-none focus:border-vermillion focus:ring-4 focus:ring-vermillion/10 resize-none transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            placeholder="A woman in a kimono walking through bamboo in the rain…"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-inkLight/40">Be specific — include mood, season, time of day</p>
            <span className="text-[11px] text-inkLight/30">{subject.length}/7500</span>
          </div>
        </div>

        {/* Style selector */}
        <div className="mb-10">
          <label className="text-[10px] font-semibold text-inkLight/50 uppercase tracking-[0.18em] mb-3 block">
            Traditions <span className="text-vermillion/50">({selectedStyles.length} selected)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {visibleStyles.map(style => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <button
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`style-card relative text-left p-4 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-vermillion/40 bg-vermillion/[0.04] shadow-[0_2px_12px_-4px_rgba(194,59,34,0.15)]'
                      : 'border-kozo/60 bg-white hover:border-inkLight/25 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-display text-[18px] leading-none">{style.name}</div>
                    <div className={`seal text-[11px] w-[22px] h-[22px] border-[1.5px] transition-all duration-300 ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
                    }`}>
                      {style.seal}
                    </div>
                  </div>
                  <div className="text-[11px] text-inkLight leading-snug">{style.nameEn}</div>
                  <div className="text-[10px] text-inkLight/40 mt-1">{style.period}</div>
                  {isSelected && (
                    <p className="text-[11px] text-inkLight mt-2 leading-relaxed line-clamp-2">{style.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={generate}
            disabled={isGenerating || selectedStyles.length === 0 || !subject.trim()}
            className="group relative overflow-hidden px-8 py-4 bg-sumi text-washi rounded-2xl font-display text-[15px] tracking-tight hover:bg-sumi/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Painting…
                </>
              ) : (
                <>Generate {selectedStyles.length} Style{selectedStyles.length !== 1 ? 's' : ''}</>
              )}
            </span>
          </button>
          {images.length > 0 && !isGenerating && (
            <button
              onClick={generate}
              className="text-[12px] text-inkLight hover:text-sumi transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/>
                <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>
              </svg>
              Regenerate
            </button>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-4 rounded-2xl bg-vermillion/[0.06] border border-vermillion/20 text-vermillion text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ──── GENERATING STATE ──── */}
      {isGenerating && (
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <div className="gold-divider mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {selectedStyles.map((id, idx) => {
              const style = getStyleById(id);
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="aspect-square rounded-2xl bg-kozo/20 flex flex-col items-center justify-center gap-3"
                >
                  <div className="text-4xl font-display text-inkLight/10 breathe">{style?.seal}</div>
                  <div className="text-[11px] text-inkLight/30 flex items-center gap-1.5">
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
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <div className="gold-divider mb-8" />
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl tracking-tight text-sumi">
                {subject.split(',')[0].slice(0, 50)}{subject.length > 50 ? '…' : ''}
              </h3>
              <p className="text-[11px] text-inkLight/50 mt-1">
                {images.length} {images.length === 1 ? 'style' : 'styles'} rendered · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Masonry-ish grid */}
          <div className={`grid gap-4 ${
            images.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            images.length === 2 ? 'grid-cols-2' :
            images.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
            images.length === 4 ? 'grid-cols-2' :
            'grid-cols-2 sm:grid-cols-3'
          }`}>
            {images.map((img, idx) => {
              const style = getStyleById(img.style);
              if (!style) return null;
              return (
                <motion.div
                  key={img.style}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <button
                    onClick={() => img.url ? setExpandedImage(img) : null}
                    className="block w-full rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-500"
                  >
                    {img.url ? (
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={img.url}
                          alt={`${style.nameEn} rendering`}
                          className="w-full h-full object-cover image-reveal group-hover:scale-[1.04] transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-kozo/20 flex items-center justify-center">
                        <span className="text-5xl font-display text-inkLight/10">{style.seal}</span>
                      </div>
                    )}
                  </button>

                  {/* Caption */}
                  <div className="mt-2.5 px-1 flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <div className="seal w-[18px] h-[18px] text-[9px] border-[1px]">{style.seal}</div>
                      <div>
                        <div className="font-display text-[15px] leading-tight">{style.nameEn}</div>
                        <div className="text-[10px] text-inkLight/50">{style.name}</div>
                      </div>
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
        <section className="max-w-6xl mx-auto px-5 pb-20">
          <div className="gold-divider mb-10" />
          <div className="text-center py-12">
            <div className="text-7xl font-display text-inkLight/[0.06] mb-3 select-none">画</div>
            <p className="text-inkLight/40 text-sm">Describe a subject, select styles, and generate.</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-inkLight/25">
              <span>浮世絵</span><span>·</span>
              <span>墨絵</span><span>·</span>
              <span>琳派</span><span>·</span>
              <span>狩野</span><span>·</span>
              <span>新版画</span><span>·</span>
              <span>禅円相</span>
            </div>
          </div>
        </section>
      )}

      {/* ──── EXPANDED IMAGE MODAL ──── */}
      <AnimatePresence>
        {expandedImage && (() => {
          const style = getStyleById(expandedImage.style);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-sumi/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              onClick={() => setExpandedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-washi rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-kozo/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="seal w-[24px] h-[24px] text-[11px] border-[1.5px]">{style?.seal}</div>
                    <div>
                      <div className="font-display text-lg sm:text-xl leading-tight">{style?.name} — {style?.nameEn}</div>
                      <div className="text-[11px] text-inkLight/50">{style?.period}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedImage.url && (
                      <a
                        href={expandedImage.url}
                        download={`nihonga-${expandedImage.style}.png`}
                        target="_blank"
                        rel="noopener"
                        className="p-2 rounded-xl hover:bg-kozo/60 text-inkLight hover:text-sumi transition-colors"
                        title="Download"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </a>
                    )}
                    <button
                      onClick={() => setExpandedImage(null)}
                      className="p-2 rounded-xl hover:bg-kozo/60 text-inkLight hover:text-sumi transition-colors"
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
                    <img
                      src={expandedImage.url}
                      alt={style?.nameEn}
                      className="w-full max-h-[65vh] object-contain rounded-2xl"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-kozo/20 rounded-2xl flex items-center justify-center">
                      <span className="text-8xl font-display text-inkLight/[0.06]">{style?.seal}</span>
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
      <footer className="border-t border-kozo/60 bg-kozo/20">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[11px] text-inkLight/30">
            <div className="seal w-[18px] h-[18px] text-[8px] border-[1px]">画</div>
            <span>Nihonga · Japanese Art Style Engine</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Powered by Venice AI</span>
          </div>
          <div className="text-[10px] text-inkLight/20 tracking-wider">
            六伝統 · 一題材 · 無限美
          </div>
        </div>
      </footer>
    </div>
  );
}