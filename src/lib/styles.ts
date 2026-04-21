const VENICE_API_KEY = process.env.VENICE_API_KEY;
const VENICE_BASE = 'https://api.venice.ai/api/v1';

export interface StyleDef {
  id: string;
  name: string;
  nameEn: string;
  period: string;
  prompt: string;
  description: string;
  seal: string;
}

export const STYLES: StyleDef[] = [
  {
    id: 'ukiyoe',
    name: '浮世絵',
    nameEn: 'Ukiyo-e',
    period: 'Edo Period, 1600–1868',
    prompt: 'Traditional Japanese ukiyo-e woodblock print, flat color areas, bold outlines, floating world aesthetic, Hokusai Hiroshige style, vivid mineral pigments on washi paper,',
    description: 'Pictures of the floating world — bold flat colors, strong outlines, scenes of pleasure and nature.',
    seal: '浮',
  },
  {
    id: 'sumie',
    name: '墨絵',
    nameEn: 'Sumi-e',
    period: 'Muromachi Period, 1336–1573',
    prompt: 'Traditional Japanese sumi-e ink wash painting, monochrome black ink on white rice paper, brush stroke Zen aesthetic, negative space, spontaneous and minimal,',
    description: 'Ink wash painting — the art of restraint. Every brushstroke is final, every empty space intentional.',
    seal: '墨',
  },
  {
    id: 'rinpa',
    name: '琳派',
    nameEn: 'Rinpa',
    period: 'Edo Period, 1600–1868',
    prompt: 'Japanese Rinpa school painting, Ogata Korin style, gold leaf background, tarashikomi wet-on-wet technique, bold decorative patterns, seasonal flowers and nature,',
    description: 'Decorative elegance — gold leaf, bold patterns, wet-on-wet technique. Where nature meets ornament.',
    seal: '琳',
  },
  {
    id: 'kano',
    name: '狩野派',
    nameEn: 'Kano School',
    period: 'Muromachi–Edo, 1400–1868',
    prompt: 'Japanese Kano school painting, gold leaf folding screen, byobu screen painting, subtle ink wash with mineral color accents, bold monochrome trees and landscapes on gold ground,',
    description: 'The official painters of Japan — gold leaf screens, powerful brushwork, the bridge between Chinese ink and Japanese color.',
    seal: '狩',
  },
  {
    id: 'shinhang',
    name: '新版画',
    nameEn: 'Shin-hanga',
    period: 'Taishō–Shōwa, 1910–1960',
    prompt: 'Japanese shin-hanga print, Kawase Hasui style, atmospheric landscape, soft light, modern romantic reinterpretation of ukiyo-e, subtle color gradients, naturalistic depiction,',
    description: 'New prints — where ukiyo-e meets Western light and shadow. Romantic, atmospheric, modern.',
    seal: '新',
  },
  {
    id: 'zenenso',
    name: '禅円相',
    nameEn: 'Zen Ensō',
    period: 'Kamakura Period, 1185–1333',
    prompt: 'Zen Buddhist ensō circle, single brushstroke circle in black sumi ink on white paper, meditative emptiness, wabi-sabi imperfection, minimal and profound,',
    description: 'The circle of enlightenment — a single brushstroke, a moment of absolute presence.',
    seal: '禅',
  },
];

export async function generateCollage(styles: string[], subject: string): Promise<{ images: { style: string; url: string; prompt: string }[] }> {
  const selectedStyles = styles.length > 0
    ? STYLES.filter(s => styles.includes(s.id))
    : STYLES;

  const results = await Promise.all(
    selectedStyles.map(async (style) => {
      const prompt = `${style.prompt} ${subject}. Masterful execution, museum quality, high detail, authentic materials.`;

      const response = await fetch(`${VENICE_BASE}/images/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VENICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'flux-2-max',
          prompt,
          width: 1024,
          height: 1024,
          style_preset: style.id === 'sumie' || style.id === 'zenenso' ? 'Photographic' : 'Photographic',
          steps: 1,
          seed: Math.floor(Math.random() * 999999),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Image gen error for ${style.id}:`, error);
        throw new Error(`Image generation failed for ${style.id}: ${response.status}`);
      }

      const data = await response.json();
      return {
        style: style.id,
        url: data.images?.[0]?.url || data.data?.[0]?.url || '',
        prompt,
      };
    })
  );

  return { images: results };
}