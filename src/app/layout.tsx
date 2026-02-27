import type { Metadata } from 'next';
import { Platypi, Ysabeau_Office } from 'next/font/google';
import './globals.css';

const platypi = Platypi({
  subsets: ['latin'],
  variable: '--font-platypi',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const ysabeau = Ysabeau_Office({
  subsets: ['latin'],
  variable: '--font-ysabeau',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Consulenza Benessere | Il Benessere Ritrovato',
  description: 'Consulenza preliminare gratuita per il tuo percorso di benessere. Scopri il tuo profilo attraverso test psicobiologici e ricevi consigli personalizzati dalla Dott.ssa Loprieno.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${platypi.variable} ${ysabeau.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
