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

function ArtCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  const img = item.images[index % item.images.length];
  // Featured cards span 2 cols for first 2 items
  const isFeatured = index < 2;

  return (
    <button
      onClick={onClick}
      className="art-card group text-left w-full"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-sm bg-[var(--bg-elevated)]"
        style={{ aspectRatio: isFeatured ? '16/10' : '4/3' }}
      >
        <img
          src={img}
          alt={item.nameEn}
          className="ink-wash w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          loading={index < 4 ? 'eager' : 'lazy'}
        />

        {/* Bottom gradient with name */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[oklch(8%_0.01_25/90%)] via-[oklch(8%_0.01_25/40%)] to-transparent pt-16 pb-3 px-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-base leading-none" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.kanji}</span>
          </div>
          <p className="text-[11px] leading-snug mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {item.nameEn}
          </p>
        </div>

        {/* Category dot — subtle, top-right */}
        <div
          className="absolute top-2.5 right-2.5 w-[7px] h-[7px] rounded-full"
          style={{ backgroundColor: item.color }}
        />
      </div>

      {/* Hover description — slides up from bottom */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-24 overflow-hidden">
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {item.description}
        </p>
      </div>
    </button>
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

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: 'oklch(12% 0.015 25 / 60%)', backdropFilter: 'blur(8px)', color: 'var(--text-primary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>
          </button>

          {/* Bottom info */}
          <div className="absolute bottom-0 inset-x-0 px-5 sm:px-8 pb-5 pt-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <SealMark char={item.kanji[0]} color={item.color} size={32} />
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl leading-none" style={{ color: 'var(--text-primary)' }}>{item.name}</h2>
                    <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{item.kanji} · {item.nameEn}</p>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm"
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}
                >
                  {item.category === 'traditional' ? 'Classical' : item.category === 'modern' ? 'Modern' : 'Lifestyle'}
                </span>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{item.period}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description + thumbnails */}
        <div className="px-5 sm:px-8 pt-4 pb-6">
          <p className="text-[14px] leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>

          {item.images.length > 1 && (
            <div className="flex gap-2 mt-5">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className="block w-20 h-14 rounded-sm overflow-hidden transition-all"
                  style={{
                    border: idx === activeImg ? '2px solid var(--text-primary)' : '2px solid transparent',
                    opacity: idx === activeImg ? 1 : 0.4,
                  }}
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
  const counts = {
    all: GALLERY.length,
    traditional: GALLERY.filter(g => g.category === 'traditional').length,
    modern: GALLERY.filter(g => g.category === 'modern').length,
    lifestyle: GALLERY.filter(g => g.category === 'lifestyle').length,
  };

  // Featured takes first 2, then grid
  const featured = filtered.slice(0, 2);
  const grid = filtered.slice(2);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* ── HERO ── */}
      <header className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-8 sm:pb-14">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-16 sm:mb-24">
          <div className="flex items-center gap-2.5">
            <SealMark char="画" color="var(--vermillion)" size={24} />
            <div>
              <div className="font-display text-[13px] leading-none" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--vermillion)' }}>日</span>本<span style={{ color: 'var(--vermillion)' }}>画</span>
              </div>
              <div className="text-[8px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>Gallery</div>
            </div>
          </div>
          <div className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
            22 Traditions · 6 Centuries
          </div>
        </nav>

        {/* Title */}
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4 reveal" style={{ color: 'var(--vermillion)' }}>
            Japanese Art & Culture
          </p>
          <h1 className="font-display text-[clamp(2rem,7vw,4rem)] leading-[0.95] tracking-tight reveal stagger-1" style={{ color: 'var(--text-primary)' }}>
            One subject.<br />Six centuries<br />
            <span style={{ color: 'var(--vermillion)' }}>of beauty.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed max-w-md reveal stagger-2" style={{ color: 'var(--text-secondary)' }}>
            From Edo woodblocks to neon rain. From Zen ensō to chibi kawaii. Explore 22 traditions of Japanese art and life — each revealing something the others cannot.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 sm:px-8"><div className="divider" /></div>

      {/* ── FILTER ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 flex-wrap">
          {(['all', 'traditional', 'modern', 'lifestyle'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase rounded-sm transition-all duration-200"
              style={{
                backgroundColor: filter === f ? 'var(--bg-surface)' : 'transparent',
                color: filter === f ? 'var(--text-primary)' : 'var(--text-tertiary)',
                border: filter === f ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              {f === 'all' ? `All ${counts.all}` : f === 'traditional' ? `Classical ${counts.traditional}` : f === 'modern' ? `Modern ${counts.modern}` : `Lifestyle ${counts.lifestyle}`}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED (2 large) ── */}
      {featured.length > 0 && (
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured.map((item, i) => (
              <ArtCard key={item.id} item={item} index={i} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        </section>
      )}

      {/* ── GRID (remaining) ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {grid.map((item, i) => (
            <ArtCard key={item.id} item={item} index={i + 2} onClick={() => setSelectedItem(item)} />
            ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8"><div className="divider" /></div>
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Through the Centuries</h2>
        <p className="text-[13px] mb-10" style={{ color: 'var(--text-tertiary)' }}>Japanese art and culture, from temple screens to neon streets.</p>
        <div className="space-y-0">
          {GALLERY.sort((a, b) => {
            const year = (s: string) => parseInt(s.match(/\d{4}/)?.[0] || '1400');
            return year(a.period) - year(b.period);
          }).map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group flex gap-4 sm:gap-6 w-full text-left py-3 transition-colors"
              style={{ borderBottom: '1px solid var(--border-light)' }}
            >
              {/* Dot + line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 transition-transform duration-200 group-hover:scale-150" style={{ backgroundColor: item.color }} />
              </div>
              {/* Content */}
              <div className="pb-3 min-w-0">
                <div className="text-[9px] uppercase tracking-[0.15em] font-semibold" style={{ color: item.color }}>{item.period}</div>
                <div className="font-display text-base leading-tight group-hover:translate-x-1 transition-transform duration-200" style={{ color: 'var(--text-primary)' }}>
                  {item.name} <span style={{ color: 'var(--text-tertiary)' }}>{item.kanji}</span>
                </div>
                <div className="text-[11px] line-clamp-1" style={{ color: 'var(--text-tertiary)' }}>{item.nameEn}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border-light)' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            <SealMark char="画" color="var(--text-tertiary)" size={16} />
            <span>Nihonga Gallery</span>
            <span style={{ color: 'var(--gold-dim)' }}>·</span>
            <span>Venice AI</span>
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