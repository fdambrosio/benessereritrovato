'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';

export default function ConsensoPage() {
  const router = useRouter();
  const { state, setConsent, setCurrentStep } = useWizard();

  const [gdprAccepted, setGdprAccepted] = useState(state.consent?.gdprAccepted ?? false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(state.consent?.disclaimerAccepted ?? false);

  useEffect(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  const canProceed = gdprAccepted && disclaimerAccepted;

  const handleNext = () => {
    if (!canProceed) return;
    setConsent({ gdprAccepted, disclaimerAccepted });
    router.push(WIZARD_STEPS[1].path);
  };

  return (
    <WizardShell
      title="Consenso e Informativa"
      subtitle="Prima di iniziare, leggi e accetta le seguenti condizioni."
      currentStep={0}
      onNext={handleNext}
      nextDisabled={!canProceed}
    >
      <div className="space-y-6">
        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-brand-gray-light/30 hover:bg-brand-lavender/30 transition-colors">
          <input
            type="checkbox"
            checked={gdprAccepted}
            onChange={(e) => setGdprAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-brand-gray-light text-brand-purple focus:ring-brand-purple accent-brand-purple"
          />
          <span className="text-sm text-brand-charcoal">
            Acconsento al trattamento dei miei dati personali ai sensi del GDPR per le finalità della consulenza.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-brand-gray-light/30 hover:bg-brand-lavender/30 transition-colors">
          <input
            type="checkbox"
            checked={disclaimerAccepted}
            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-brand-gray-light text-brand-purple focus:ring-brand-purple accent-brand-purple"
          />
          <span className="text-sm text-brand-charcoal">
            Comprendo che questa consulenza non ha finalità terapeutiche di tipo medico o psicologico e che le indicazioni vanno sottoposte alla valutazione del medico curante.
          </span>
        </label>
      </div>
    </WizardShell>
  );
}
