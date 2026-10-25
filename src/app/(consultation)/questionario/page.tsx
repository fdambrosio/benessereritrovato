'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import RadioGroup from '@/components/ui/RadioGroup';
import SliderScale from '@/components/ui/SliderScale';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import { sixAAreas, sixAOptions, sixASelfAssessmentItems, sixAAnswerSchema, sixAAnswersSchema, sixASelfAssessmentSchema } from '@/data/six-a';
import { submitSixAConsultation } from '../actions';
import type { AnswerValue } from '@/types/test';

export default function QuestionarioPage() {
  const router = useRouter();
  const { state, setSixAAnswers, setSelfAssessmentAnswers, setCurrentStep } = useWizard();

  const [abcdAnswers, setAbcdAnswers] = useState<Record<number, AnswerValue>>(state.sixAAnswers ?? {});
  const [sliderAnswers, setSliderAnswers] = useState<Record<string, number>>(
    state.sixAAnswers ? state.selfAssessmentAnswers ?? {} : {},
  );
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const allAbcdAnswered = sixAAreas.every(
    (area) => area.questions.every((q) => abcdAnswers[q.id])
  );
  const allSlidersAnswered = sixASelfAssessmentItems.every(
    (item) => sliderAnswers[item.id] !== undefined
  );
  const isComplete = allAbcdAnswered && allSlidersAnswered;

  const handleAbcdAnswer = (questionId: number, value: AnswerValue) => {
    const updated = { ...abcdAnswers, [questionId]: value };
    setAbcdAnswers(updated);
    setSixAAnswers(updated);
  };

  const handleSliderAnswer = (itemId: string, value: number) => {
    const updated = { ...sliderAnswers, [itemId]: value };
    setSliderAnswers(updated);
    setSelfAssessmentAnswers(updated);
  };

  const handleSubmit = async () => {
    setAttempted(true);
    if (!isComplete) return;
    if (!state.personalData) {
      router.push(WIZARD_STEPS[1].path);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitSixAConsultation({
        personalData: state.personalData,
        sixAAnswers: sixAAnswersSchema.parse(abcdAnswers),
        selfAssessmentAnswers: sixASelfAssessmentSchema.parse(sliderAnswers),
      });

      // Store result for the results page
      sessionStorage.setItem('submission-result', JSON.stringify(result));

      router.push(WIZARD_STEPS[3].path);
    } catch {
      setSubmitError('Si è verificato un errore. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(WIZARD_STEPS[1].path);
  };

  return (
    <WizardShell
      title="Test delle 6A"
      subtitle="Rispondi d'impulso pensando alla tua routine delle ultime settimane."
      currentStep={2}
      onBack={handleBack}
      onNext={handleSubmit}
      nextLabel="Invia"
      nextDisabled={isSubmitting}
      isLoading={isSubmitting}
    >
      <div className="space-y-8">
        {sixAAreas.map((area) => (
          <div key={area.id}>
            <h3 className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-4">
              {area.label}
            </h3>
            <div className="space-y-5">
              {area.questions.map((q) => {
                const key = `six-a-${q.id}`;
                const hasError = attempted && !abcdAnswers[q.id];
                return (
                  <div key={key}>
                    <p className="text-sm text-brand-charcoal mb-2.5 leading-relaxed">
                      <span className="font-medium text-brand-dark">{q.id}.</span>{' '}
                      {q.text}
                    </p>
                    <RadioGroup
                      name={key}
                      value={abcdAnswers[q.id]}
                      onChange={(v) => handleAbcdAnswer(q.id, sixAAnswerSchema.parse(v))}
                      options={sixAOptions}
                      showOptionLabels
                      error={hasError}
                    />
                    {hasError && (
                      <p className="text-xs text-red-500 mt-1">Seleziona una risposta</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Self Assessment Sliders */}
        <div>
          <h3 className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-4">
            Autovalutazione Globale
          </h3>
          <p className="text-xs text-brand-gray-medium mb-4">
            Indica il tuo grado di accordo su una scala da 1 (per niente) a 10 (completamente).
          </p>
          <div className="space-y-5">
            {sixASelfAssessmentItems.map((item, idx) => {
              const hasError = attempted && sliderAnswers[item.id] === undefined;
              return (
                <div key={item.id}>
                  <p className="text-sm text-brand-charcoal mb-2.5 leading-relaxed">
                    <span className="font-medium text-brand-dark">{13 + idx}.</span>{' '}
                    {item.text}
                  </p>
                  <SliderScale
                    value={sliderAnswers[item.id]}
                    onChange={(v) => handleSliderAnswer(item.id, v)}
                  />
                  {hasError && (
                    <p className="text-xs text-red-500 mt-1">Seleziona un valore</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {attempted && !isComplete && (
          <p className="text-sm text-red-500 text-center font-medium">
            Rispondi a tutte le domande prima di procedere.
          </p>
        )}

        {submitError && (
          <p className="text-sm text-red-500 text-center font-medium">{submitError}</p>
        )}
      </div>
    </WizardShell>
  );
}
