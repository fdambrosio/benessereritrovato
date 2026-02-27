'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import TestSection from '@/components/wizard/TestSection';
import { useWizard } from '@/context/WizardContext';
import { FULL_WIZARD_STEPS } from '@/types/wizard';
import { medicineAlternativeTest } from '@/data/tests/medicine-alternative';
import type { AnswerValue } from '@/types/test';

export default function MedicineAlternativePage() {
  const router = useRouter();
  const { state, setMedicineAlternativeAnswers, setCurrentStep } = useWizard();

  const [answers, setAnswers] = useState<Record<number, AnswerValue>>(
    state.medicineAlternativeAnswers ?? {}
  );
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const allAnswered = medicineAlternativeTest.questions.every((q) => answers[q.id]);

  const handleAnswer = (questionId: number, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    setAttempted(true);
    if (!allAnswered) return;
    setMedicineAlternativeAnswers(answers);
    router.push(FULL_WIZARD_STEPS[5].path);
  };

  const handleBack = () => {
    router.push(FULL_WIZARD_STEPS[3].path);
  };

  return (
    <WizardShell
      title={medicineAlternativeTest.title}
      subtitle={medicineAlternativeTest.subtitle}
      currentStep={4}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={attempted && !allAnswered}
    >
      <TestSection
        testConfig={medicineAlternativeTest}
        answers={answers}
        onAnswer={handleAnswer}
        attempted={attempted}
      />
      {attempted && !allAnswered && (
        <p className="mt-4 text-sm text-red-500">
          Rispondi a tutte le domande prima di procedere.
        </p>
      )}
    </WizardShell>
  );
}
