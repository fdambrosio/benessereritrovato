import type { Metadata } from 'next';
import { Platypi, Ysabeau_Office } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
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
  metadataBase: new URL('https://www.ilbenessereritrovato.it'),
  title: {
    default: 'Consulenza Benessere | Il Benessere Ritrovato',
    template: '%s | Il Benessere Ritrovato',
  },
  description: 'Consulenza preliminare gratuita per il tuo percorso di benessere. Scopri il tuo profilo attraverso test psicobiologici e ricevi consigli personalizzati dalla Dott.ssa Loprieno.',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Il Benessere Ritrovato',
    title: 'Consulenza Benessere | Il Benessere Ritrovato',
    description: 'Consulenza preliminare gratuita per il tuo percorso di benessere psicofisico. Test personalizzati e consigli dalla Dott.ssa Roberta Loprieno.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consulenza Benessere | Il Benessere Ritrovato',
    description: 'Consulenza preliminare gratuita per il tuo percorso di benessere psicofisico.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${platypi.variable} ${ysabeau.variable} antialiased`}>
        <GoogleAnalytics />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
