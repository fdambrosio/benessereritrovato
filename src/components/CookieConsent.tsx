'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setVisible(false);
    window.dispatchEvent(new Event('cookie-consent-updated'));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-brand-gray-light/30 shadow-lg">
      <div className="max-w-[800px] mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-brand-charcoal flex-1">
          Questo sito utilizza cookie tecnici e, con il tuo consenso, cookie analitici per migliorare la tua esperienza.{' '}
          <a href="/privacy-policy" className="text-brand-purple hover:underline">
            Leggi la privacy policy
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-brand-gray-light rounded-lg text-brand-charcoal hover:bg-brand-lavender/30 transition-colors"
          >
            Rifiuta
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark transition-colors"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
