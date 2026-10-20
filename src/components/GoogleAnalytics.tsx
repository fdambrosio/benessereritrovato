'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      setConsentGiven(true);
    }

    const handleConsentUpdate = () => {
      const updated = localStorage.getItem('cookie-consent');
      if (updated === 'accepted') {
        setConsentGiven(true);
      }
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
  }, []);

  if (!GA_MEASUREMENT_ID || !consentGiven) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
