import './globals.css';

export const metadata = {
  title: 'Nihonga — Japanese Art & Culture Gallery',
  description: 'Explore 22 traditions of Japanese art and life — from Ukiyo-e woodblocks to cyberpunk neon, from Zen gardens to festival fireworks.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-body antialiased">
        {children}
      </body>
    </html>
  );
}