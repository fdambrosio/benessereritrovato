'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import RadioGroup from '@/components/ui/RadioGroup';
import SliderScale from '@/components/ui/SliderScale';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import { liteAbcdQuestions, liteSelfAssessmentItems, groupLiteQuestionsByTest } from '@/data/lite-questions';
import { submitConsultation } from '../actions';
import type { AnswerValue } from '@/types/test';

const ABCD_OPTIONS = [
  { value: 'A', label: 'Molto d\'accordo' },
  { value: 'B', label: 'Abbastanza d\'accordo' },
  { value: 'C', label: 'Poco d\'accordo' },
  { value: 'D', label: 'Per niente d\'accordo' },
];

export default function QuestionarioPage() {
  const router = useRouter();
  const { state, setLocusAnswers, setEventiSaluteAnswers, setMedicineAlternativeAnswers, setLeadershipAnswers, setSelfAssessmentAnswers, setCurrentStep } = useWizard();

  const [abcdAnswers, setAbcdAnswers] = useState<Record<string, AnswerValue>>({});
  const [sliderAnswers, setSliderAnswers] = useState<Record<string, number>>({});
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const groupedQuestions = groupLiteQuestionsByTest();

  const testGroupLabels: Record<string, string> = {
    'locus-of-control': 'Autoefficacia',
    'eventi-salute': 'Salute e Benessere',
    'medicine-alternative': 'Medicine Alternative',
    'leadership': 'Autonomia',
  };

  const allAbcdAnswered = liteAbcdQuestions.every(
    (q) => abcdAnswers[`${q.testId}-${q.question.id}`]
  );
  const allSlidersAnswered = liteSelfAssessmentItems.every(
    (item) => sliderAnswers[item.id] !== undefined
  );
  const isComplete = allAbcdAnswered && allSlidersAnswered;

  const handleAbcdAnswer = (testId: string, questionId: number, value: AnswerValue) => {
    setAbcdAnswers((prev) => ({ ...prev, [`${testId}-${questionId}`]: value }));
  };

  const handleSliderAnswer = (itemId: string, value: number) => {
    setSliderAnswers((prev) => ({ ...prev, [itemId]: value }));
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
      // Distribute ABCD answers into 4 separate test records
      const locusAnswers: Record<number, AnswerValue> = {};
      const eventiSaluteAnswers: Record<number, AnswerValue> = {};
      const medicineAlternativeAnswers: Record<number, AnswerValue> = {};
      const leadershipAnswers: Record<number, AnswerValue> = {};

      for (const q of liteAbcdQuestions) {
        const answer = abcdAnswers[`${q.testId}-${q.question.id}`];
        if (!answer) continue;
        switch (q.testId) {
          case 'locus-of-control':
            locusAnswers[q.question.id] = answer;
            break;
          case 'eventi-salute':
            eventiSaluteAnswers[q.question.id] = answer;
            break;
          case 'medicine-alternative':
            medicineAlternativeAnswers[q.question.id] = answer;
            break;
          case 'leadership':
            leadershipAnswers[q.question.id] = answer;
            break;
        }
      }

      // Save to wizard context
      setLocusAnswers(locusAnswers);
      setEventiSaluteAnswers(eventiSaluteAnswers);
      setMedicineAlternativeAnswers(medicineAlternativeAnswers);
      setLeadershipAnswers(leadershipAnswers);
      setSelfAssessmentAnswers(sliderAnswers);

      // Submit to server
      const result = await submitConsultation({
        personalData: state.personalData,
        locusAnswers,
        eventiSaluteAnswers,
        medicineAlternativeAnswers,
        leadershipAnswers,
        selfAssessmentAnswers: sliderAnswers,
        isLite: true,
      });

      // Store result for the results page
      sessionStorage.setItem('submission-result', JSON.stringify(result));

      router.push(WIZARD_STEPS[3].path);
    } catch (error) {
      console.error('Submission error:', error);
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
      title="Questionario"
      subtitle="Rispondi alle seguenti domande in base a come ti senti abitualmente. Non ci sono risposte giuste o sbagliate."
      currentStep={2}
      onBack={handleBack}
      onNext={handleSubmit}
      nextLabel="Invia"
      nextDisabled={isSubmitting}
      isLoading={isSubmitting}
    >
      <div className="space-y-8">
        {/* ABCD Questions grouped by test area */}
        {Array.from(groupedQuestions.entries()).map(([testId, questions]) => (
          <div key={testId}>
            <h3 className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-4">
              {testGroupLabels[testId] || testId}
            </h3>
            <div className="space-y-5">
              {questions.map((q, idx) => {
                const key = `${q.testId}-${q.question.id}`;
                const hasError = attempted && !abcdAnswers[key];
                return (
                  <div key={key}>
                    <p className="text-sm text-brand-charcoal mb-2.5 leading-relaxed">
                      <span className="font-medium text-brand-dark">{idx + 1}.</span>{' '}
                      {q.question.text}
                    </p>
                    <RadioGroup
                      name={key}
                      value={abcdAnswers[key]}
                      onChange={(v) => handleAbcdAnswer(q.testId, q.question.id, v as AnswerValue)}
                      options={ABCD_OPTIONS}
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
            Autovalutazione
          </h3>
          <p className="text-xs text-brand-gray-medium mb-4">
            Indica il tuo grado di accordo su una scala da 1 (per niente) a 10 (completamente).
          </p>
          <div className="space-y-5">
            {liteSelfAssessmentItems.map((item) => {
              const hasError = attempted && sliderAnswers[item.id] === undefined;
              return (
                <div key={item.id}>
                  <p className="text-sm text-brand-charcoal mb-2.5 leading-relaxed">
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
