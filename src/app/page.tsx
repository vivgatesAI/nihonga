'use client';

import { useState } from 'react';
import { GALLERY, GalleryItem } from '@/lib/gallery';

function SealMark({ char, color, size = 28 }: { char: string; color: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center border-[1.5px] rounded-[1px] shrink-0"
      style={{ width: size, height: size, borderColor: color, color, fontSize: size * 0.48, fontFamily: "'Vollkorn', serif", lineHeight: 1 }}
    >
      {char}
    </div>
  );
}

function ExpandedView({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: 'oklch(8% 0.01 25 / 94%)', backdropFilter: 'blur(24px)' }}
      onClick={onClose}
    >
      <div
        className="reveal w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm"
        style={{ backgroundColor: 'var(--bg-elevated)', boxShadow: '0 40px 80px -20px oklch(8% 0.02 25 / 60%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] sm:aspect-[2/1]">
          <img
            src={item.images[activeImg]}
            alt={item.nameEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full"
            style={{ backgroundColor: 'oklch(12% 0.015 25 / 60%)', backdropFilter: 'blur(8px)', color: 'var(--text-primary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>
          </button>
          <div className="absolute bottom-0 inset-x-0 px-5 sm:px-8 pb-5 pt-16">
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <SealMark char={item.kanji[0]} color={item.color} size={32} />
                <div>
                  <h2 className="font-display text-xl sm:text-2xl leading-none" style={{ color: 'var(--text-primary)' }}>{item.name}</h2>
                  <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{item.kanji} · {item.nameEn}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                  {item.category === 'traditional' ? 'Classical' : item.category === 'modern' ? 'Modern' : 'Lifestyle'}
                </span>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{item.period}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 sm:px-8 pt-4 pb-6">
          <p className="text-[14px] leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
          {item.images.length > 1 && (
            <div className="flex gap-2 mt-5">
              {item.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImg(idx)}
                  className="block w-20 h-14 rounded-sm overflow-hidden"
                  style={{ border: idx === activeImg ? '2px solid var(--text-primary)' : '2px solid transparent', opacity: idx === activeImg ? 1 : 0.4 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NihongaGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'traditional' | 'modern' | 'lifestyle'>('all');

  const filtered = filter === 'all' ? GALLERY : GALLERY.filter(g => g.category === filter);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* ── NAV BAR ── */}
      <nav className="sticky top-0 z-40" style={{ backgroundColor: 'oklch(10% 0.012 25 / 85%)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SealMark char="画" color="var(--vermillion)" size={24} />
            <div>
              <div className="font-display text-[13px] leading-none" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--vermillion)' }}>日</span>本<span style={{ color: 'var(--vermillion)' }}>画</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
            {filtered.length} {filtered.length === 1 ? 'Style' : 'Styles'}
          </div>
        </div>
      </nav>

      {/* ── FILTER BAR ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-2 flex items-center gap-3 overflow-x-auto" style={{ borderBottom: '1px solid var(--border-light)' }}>
        {(['all', 'traditional', 'modern', 'lifestyle'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase whitespace-nowrap rounded-sm transition-all duration-200"
            style={{
              backgroundColor: filter === f ? 'var(--bg-surface)' : 'transparent',
              color: filter === f ? 'var(--text-primary)' : 'var(--text-tertiary)',
              border: filter === f ? '1px solid var(--border)' : '1px solid transparent',
            }}
          >
            {f === 'all' ? `All ${GALLERY.length}` : f === 'traditional' ? 'Classical' : f === 'modern' ? 'Modern' : 'Lifestyle'}
          </button>
        ))}
      </div>

      {/* ── GALLERY GRID ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="text-left group"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '4/3', backgroundColor: 'var(--bg-elevated)' }}>
                <img
                  src={item.images[0]}
                  alt={item.nameEn}
                  className="ink-wash w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  loading={i < 8 ? 'eager' : 'lazy'}
                />
                {/* Bottom overlay with name */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[oklch(8%_0.01_25/85%)] via-[oklch(8%_0.01_25/30%)] to-transparent pt-10 pb-2.5 px-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-[15px] leading-none" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{item.kanji}</span>
                  </div>
                </div>
                {/* Category dot & image count */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  {item.images.length > 2 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium" 
                      style={{ backgroundColor: 'oklch(15% 0.01 25 / 80%)', color: 'var(--text-primary)' }}>
                      {item.images.length}
                    </span>
                  )}
                  <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: item.color }} />
                </div>
              </div>

              {/* Hover description */}
              <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border-light)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            <SealMark char="画" color="var(--text-tertiary)" size={16} />
            <span>Nihonga Gallery · Venice AI</span>
          </div>
          <div className="text-[9px] tracking-[0.15em]" style={{ color: 'oklch(35% 0.01 25)' }}>
            六伝統 · 一題材 · 無限美
          </div>
        </div>
      </footer>

      {/* ── EXPANDED VIEW ── */}
      {selectedItem && (
        <ExpandedView item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}