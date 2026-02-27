'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import TestSection from '@/components/wizard/TestSection';
import { useWizard } from '@/context/WizardContext';
import { FULL_WIZARD_STEPS } from '@/types/wizard';
import { eventiSaluteTest } from '@/data/tests/eventi-salute';
import type { AnswerValue } from '@/types/test';

export default function EventiSalutePage() {
  const router = useRouter();
  const { state, setEventiSaluteAnswers, setCurrentStep } = useWizard();

  const [answers, setAnswers] = useState<Record<number, AnswerValue>>(
    state.eventiSaluteAnswers ?? {}
  );
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const allAnswered = eventiSaluteTest.questions.every((q) => answers[q.id]);

  const handleAnswer = (questionId: number, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    setAttempted(true);
    if (!allAnswered) return;
    setEventiSaluteAnswers(answers);
    router.push(FULL_WIZARD_STEPS[4].path);
  };

  const handleBack = () => {
    router.push(FULL_WIZARD_STEPS[2].path);
  };

  return (
    <WizardShell
      title={eventiSaluteTest.title}
      subtitle={eventiSaluteTest.subtitle}
      currentStep={3}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={attempted && !allAnswered}
    >
      <TestSection
        testConfig={eventiSaluteTest}
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
