'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STYLES, StyleDef } from '@/lib/styles';
import {
  Brush, Sparkles, Loader2, RefreshCw,
  ChevronRight, Download, X
} from 'lucide-react';

interface GeneratedImage {
  style: string;
  url: string;
  prompt: string;
}

export default function NihongaApp() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['ukiyoe', 'sumie', 'rinpa']);
  const [subject, setSubject] = useState('A serene Japanese garden with cherry blossoms and a wooden bridge over still water');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<GeneratedImage | null>(null);

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const generate = useCallback(async () => {
    if (selectedStyles.length === 0) { setError('Select at least one style'); return; }
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

  const getStyleById = (id: string): StyleDef | undefined => STYLES.find(s => s.id === id);

  return (
    <div className="min-h-screen bg-washi text-sumi">
      {/* ──── HEADER ──── */}
      <header className="border-b border-kozo">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-2xl tracking-tight">
              <span className="text-vermillion">日</span>本<span className="text-vermillion">画</span>
            </h1>
            <span className="text-inkLight text-sm hidden sm:inline">Japanese Art Style Engine</span>
          </div>
          <a href="https://github.com/vivgatesAI/nihonga" target="_blank" rel="noopener"
            className="text-inkLight text-xs hover:text-sumi transition-colors">
            About
          </a>
        </div>
      </header>

      {/* ──── MAIN ──── */}
      <main className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <section className="py-16 sm:py-24">
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight leading-[1.1] max-w-xl">
            One subject.<br />
            <span className="text-vermillion">Six traditions.</span><br />
            Infinite beauty.
          </h2>
          <p className="mt-6 text-inkLight text-lg max-w-lg leading-relaxed">
            Generate a Japanese art collage — the same scene rendered through Ukiyo-e, Sumi-e, Rinpa, Kano, Shin-hanga, and Zen Ensō. Each style reveals something different about the subject.
          </p>
        </section>

        {/* Subject input */}
        <section className="pb-8">
          <label className="text-[11px] font-medium text-inkLight uppercase tracking-widest">Subject</label>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            rows={2}
            className="mt-2 w-full bg-white border border-kozo rounded-xl px-4 py-3 text-sm text-sumi placeholder:text-inkLight/40 focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/15 resize-none"
            placeholder="Describe your scene..."
          />
        </section>

        {/* Style selector */}
        <section className="pb-8">
          <label className="text-[11px] font-medium text-inkLight uppercase tracking-widest">Styles</label>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STYLES.map(style => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <button
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-vermillion bg-vermillion/5 shadow-none'
                      : 'border-kozo bg-white hover:border-inkLight/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-lg leading-tight">{style.name}</div>
                      <div className="text-[11px] text-inkLight mt-0.5">{style.nameEn} · {style.period}</div>
                    </div>
                    <span className={`text-2xl font-display leading-none ${isSelected ? 'text-vermillion' : 'text-inkLight/20'}`}>
                      {style.seal}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-xs text-inkLight leading-snug line-clamp-2">{style.description}</div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Generate button */}
        <section className="pb-16">
          <button
            onClick={generate}
            disabled={isGenerating || selectedStyles.length === 0}
            className="group flex items-center gap-3 px-8 py-4 bg-sumi text-washi rounded-xl font-display text-lg hover:bg-sumi/90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            {isGenerating ? (
              <><Loader2 size={20} className="animate-spin" /> Generating...</>
            ) : (
              <><Brush size={20} /> Generate Collage</>
            )}
          </button>
          {selectedStyles.length === 0 && (
            <p className="mt-2 text-xs text-vermillion">Select at least one style above</p>
          )}
        </section>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mb-8 p-4 rounded-xl bg-vermillion/8 border border-vermillion/20 flex items-center gap-3 text-vermillion text-sm">
              <X size={16} className="shrink-0 cursor-pointer" onClick={() => setError(null)} />
              <span className="flex-1">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {isGenerating && (
          <section className="pb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedStyles.map(id => {
                const style = getStyleById(id);
                return (
                  <div key={id} className="aspect-square bg-kozo/30 rounded-xl flex flex-col items-center justify-center gap-3">
                    <div className="text-4xl font-display text-inkLight/15 float-gentle">{style?.seal}</div>
                    <div className="text-xs text-inkLight/40 flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" /> Painting...
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Results */}
        {images.length > 0 && !isGenerating && (
          <section className="pb-20">
            <div className="flex items-baseline justify-between mb-8">
              <h3 className="font-display text-2xl">
                {subject.split(',')[0].slice(0, 40)}{subject.length > 40 ? '...' : ''}
              </h3>
              <button onClick={generate} className="flex items-center gap-1.5 text-xs text-inkLight hover:text-sumi transition-colors">
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, idx) => {
                const style = getStyleById(img.style);
                return (
                  <motion.div
                    key={img.style}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => setExpandedImage(img)}
                      className="block w-full aspect-square rounded-xl overflow-hidden bg-kozo/20"
                    >
                      {img.url ? (
                        <img
                          src={img.url}
                          alt={`${style?.nameEn} rendering`}
                          className="w-full h-full object-cover image-reveal group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-inkLight/20">
                          <span className="text-5xl font-display">{style?.seal}</span>
                        </div>
                      )}
                    </button>
                    <div className="mt-2.5 px-0.5 flex items-baseline justify-between">
                      <div>
                        <div className="font-display text-base leading-tight">{style?.name}</div>
                        <div className="text-[11px] text-inkLight">{style?.nameEn}</div>
                      </div>
                      <span className="text-vermillion text-xs font-display">{style?.seal}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {images.length === 0 && !isGenerating && !error && (
          <section className="pb-20 text-center py-16">
            <div className="text-6xl font-display text-inkLight/8 mb-4">画</div>
            <p className="text-inkLight text-sm">Select styles, describe a scene, and generate your collage.</p>
          </section>
        )}
      </main>

      {/* ──── EXPANDED IMAGE MODAL ──── */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-sumi/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-washi rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-kozo flex items-center justify-between">
                <div>
                  <div className="font-display text-xl">
                    {getStyleById(expandedImage.style)?.name} — {getStyleById(expandedImage.style)?.nameEn}
                  </div>
                  <div className="text-xs text-inkLight mt-0.5">{getStyleById(expandedImage.style)?.period}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={expandedImage.url} target="_blank" rel="noopener" download
                    className="p-2 rounded-lg hover:bg-kozo transition-colors text-inkLight hover:text-sumi">
                    <Download size={18} />
                  </a>
                  <button onClick={() => setExpandedImage(null)}
                    className="p-2 rounded-lg hover:bg-kozo transition-colors text-inkLight hover:text-sumi">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {expandedImage.url ? (
                  <img src={expandedImage.url} alt={getStyleById(expandedImage.style)?.nameEn}
                    className="w-full max-h-[70vh] object-contain rounded-xl" />
                ) : (
                  <div className="w-full aspect-square bg-kozo/20 rounded-xl flex items-center justify-center">
                    <span className="text-8xl font-display text-inkLight/10">{getStyleById(expandedImage.style)?.seal}</span>
                  </div>
                )}
              </div>
              <div className="px-4 pb-4">
                <p className="text-xs text-inkLight leading-relaxed">{getStyleById(expandedImage.style)?.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──── FOOTER ──── */}
      <footer className="border-t border-kozo">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-inkLight/50">
            <span className="font-display text-sm text-inkLight/30">画</span>
            <span className="ml-2">Nihonga — Japanese Art Style Engine</span>
            <span className="mx-2">·</span>
            <span>Powered by Venice AI & Flux 2</span>
          </div>
          <div className="text-xs text-inkLight/30">
            Six traditions. One subject. Infinite beauty.
          </div>
        </div>
      </footer>
    </div>
  );
}