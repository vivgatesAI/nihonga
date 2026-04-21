export const metadata = {
  title: 'Nihonga — Japanese Art Style Generator',
  description: 'Generate stunning collages across Japanese art styles. Ukiyo-e, Sumi-e, Rinpa, Kano, and more — powered by AI.',
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