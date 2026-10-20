import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ilbenessereritrovato.it';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/risultati',
          '/dati-personali',
          '/questionario',
          '/locus-of-control',
          '/eventi-salute',
          '/medicine-alternative',
          '/leadership',
          '/autovalutazione',
          '/stile-di-vita',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
