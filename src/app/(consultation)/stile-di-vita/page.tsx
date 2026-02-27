'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import CheckboxItem from '@/components/ui/CheckboxItem';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import type { LifestyleData } from '@/types/wizard';
import { foodHabitItems, lifestyleIndicators } from '@/data/lifestyle';
import { submitConsultation } from '../actions';

const defaultDailyDiet = {
  colazione: '',
  spuntino: '',
  pranzo: '',
  merenda: '',
  cena: '',
  dopocena: '',
  fuoripasto: '',
};

function buildDefaultLifestyle(): LifestyleData {
  const foodHabits: LifestyleData['foodHabits'] = {};
  for (const item of foodHabitItems) {
    foodHabits[item.id] = { checked: false, frequency: '', variant: undefined };
  }
  const indicators: LifestyleData['lifestyleIndicators'] = {};
  for (const item of lifestyleIndicators) {
    indicators[item.id] = { checked: false, numericValue: undefined };
  }
  return {
    foodHabits,
    lifestyleIndicators: indicators,
    dailyDiet: { ...defaultDailyDiet },
    noteAggiuntive: '',
  };
}

export default function StileDiVitaPage() {
  const router = useRouter();
  const { state, setLifestyleData, setCurrentStep } = useWizard();

  const [data, setData] = useState<LifestyleData>(
    state.lifestyleData ?? buildDefaultLifestyle()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentStep(7);
  }, [setCurrentStep]);

  // Food habit handlers
  const toggleFoodHabit = (id: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      foodHabits: {
        ...prev.foodHabits,
        [id]: { ...prev.foodHabits[id], checked },
      },
    }));
  };

  const setFoodFrequency = (id: string, frequency: string) => {
    setData((prev) => ({
      ...prev,
      foodHabits: {
        ...prev.foodHabits,
        [id]: { ...prev.foodHabits[id], frequency },
      },
    }));
  };

  const setFoodVariant = (id: string, variant: string) => {
    setData((prev) => ({
      ...prev,
      foodHabits: {
        ...prev.foodHabits,
        [id]: { ...prev.foodHabits[id], variant },
      },
    }));
  };

  // Lifestyle indicator handlers
  const toggleIndicator = (id: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      lifestyleIndicators: {
        ...prev.lifestyleIndicators,
        [id]: { ...prev.lifestyleIndicators[id], checked },
      },
    }));
  };

  const setIndicatorNumeric = (id: string, numericValue: string) => {
    setData((prev) => ({
      ...prev,
      lifestyleIndicators: {
        ...prev.lifestyleIndicators,
        [id]: { ...prev.lifestyleIndicators[id], numericValue },
      },
    }));
  };

  // Daily diet handler
  const setDietField = (field: keyof LifestyleData['dailyDiet'], value: string) => {
    setData((prev) => ({
      ...prev,
      dailyDiet: { ...prev.dailyDiet, [field]: value },
    }));
  };

  const handleNext = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      setLifestyleData(data);

      const result = await submitConsultation({
        personalData: state.personalData!,
        locusAnswers: state.locusAnswers!,
        eventiSaluteAnswers: state.eventiSaluteAnswers!,
        medicineAlternativeAnswers: state.medicineAlternativeAnswers!,
        leadershipAnswers: state.leadershipAnswers!,
        selfAssessmentAnswers: state.selfAssessmentAnswers!,
        lifestyleData: data,
      });

      sessionStorage.setItem('submission-result', JSON.stringify(result));
      router.push(WIZARD_STEPS[8].path);
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitError('Si è verificato un errore durante l\'invio. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(WIZARD_STEPS[6].path);
  };

  const textareaClass =
    'w-full px-3 py-2 text-sm border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple resize-y min-h-[60px]';

  const dietFields: { key: keyof LifestyleData['dailyDiet']; label: string }[] = [
    { key: 'colazione', label: 'Colazione' },
    { key: 'spuntino', label: 'Spuntino mattina' },
    { key: 'pranzo', label: 'Pranzo' },
    { key: 'merenda', label: 'Merenda' },
    { key: 'cena', label: 'Cena' },
    { key: 'dopocena', label: 'Dopo cena' },
    { key: 'fuoripasto', label: 'Fuori pasto' },
  ];

  return (
    <WizardShell
      title="Stile di Vita"
      subtitle="Indica le tue abitudini alimentari, il tuo stile di vita e la tua alimentazione quotidiana."
      currentStep={7}
      onBack={handleBack}
      onNext={handleNext}
      nextLabel="Visualizza risultati"
      isLoading={isSubmitting}
      nextDisabled={isSubmitting}
    >
      <div className="space-y-8">
        {/* Food Habits Section */}
        <section>
          <h3 className="text-lg font-semibold text-brand-dark mb-1">Abitudini Alimentari</h3>
          <p className="text-xs text-brand-gray-medium mb-4">
            Seleziona gli alimenti che consumi abitualmente e indica la frequenza.
          </p>
          <div className="border border-brand-gray-light/30 rounded-lg p-4">
            {foodHabitItems.map((item) => (
              <CheckboxItem
                key={item.id}
                label={item.label}
                checked={data.foodHabits[item.id]?.checked ?? false}
                onChange={(checked) => toggleFoodHabit(item.id, checked)}
                hasFrequency={item.hasFrequency}
                frequencyValue={data.foodHabits[item.id]?.frequency ?? ''}
                onFrequencyChange={(v) => setFoodFrequency(item.id, v)}
                hasVariant={item.hasVariant}
                variants={item.variants}
                selectedVariant={data.foodHabits[item.id]?.variant ?? ''}
                onVariantChange={(v) => setFoodVariant(item.id, v)}
              />
            ))}
          </div>
        </section>

        {/* Lifestyle Indicators Section */}
        <section>
          <h3 className="text-lg font-semibold text-brand-dark mb-1">Indicatori di Stile di Vita</h3>
          <p className="text-xs text-brand-gray-medium mb-4">
            Seleziona le condizioni che ti riguardano.
          </p>
          <div className="border border-brand-gray-light/30 rounded-lg p-4">
            {lifestyleIndicators.map((item) => (
              <CheckboxItem
                key={item.id}
                label={item.label}
                checked={data.lifestyleIndicators[item.id]?.checked ?? false}
                onChange={(checked) => toggleIndicator(item.id, checked)}
                hasNumericInput={item.hasNumericInput}
                numericLabel={item.numericLabel}
                numericValue={data.lifestyleIndicators[item.id]?.numericValue ?? ''}
                onNumericChange={(v) => setIndicatorNumeric(item.id, v)}
              />
            ))}
          </div>
        </section>

        {/* Daily Diet Section */}
        <section>
          <h3 className="text-lg font-semibold text-brand-dark mb-1">Alimentazione Quotidiana</h3>
          <p className="text-xs text-brand-gray-medium mb-4">
            Descrivi brevemente cosa mangi abitualmente in ogni pasto.
          </p>
          <div className="space-y-4">
            {dietFields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  {label}
                </label>
                <textarea
                  value={data.dailyDiet[key]}
                  onChange={(e) => setDietField(key, e.target.value)}
                  className={textareaClass}
                  rows={2}
                  placeholder={`Cosa mangi a ${label.toLowerCase()}?`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Additional Notes */}
        <section>
          <h3 className="text-lg font-semibold text-brand-dark mb-1">Note Aggiuntive</h3>
          <p className="text-xs text-brand-gray-medium mb-4">
            Aggiungi eventuali informazioni che ritieni utili.
          </p>
          <textarea
            value={data.noteAggiuntive}
            onChange={(e) => setData((prev) => ({ ...prev, noteAggiuntive: e.target.value }))}
            className={textareaClass}
            rows={4}
            placeholder="Allergie, intolleranze, patologie, farmaci assunti, o qualsiasi altra informazione rilevante..."
          />
        </section>

        {submitError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
            {submitError}
          </p>
        )}
      </div>
    </WizardShell>
  );
}
