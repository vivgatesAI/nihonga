export const metadata = {
  title: 'Nihonga — Japanese Art Gallery',
  description: 'Explore twelve centuries of Japanese art traditions — from Ukiyo-e woodblocks to cyberpunk neon. A visual gallery of classical and modern Japanese aesthetics.',
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