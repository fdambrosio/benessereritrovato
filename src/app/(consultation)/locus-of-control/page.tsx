'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import TestSection from '@/components/wizard/TestSection';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import { locusOfControlTest } from '@/data/tests/locus-of-control';
import type { AnswerValue } from '@/types/test';

export default function LocusOfControlPage() {
  const router = useRouter();
  const { state, setLocusAnswers, setCurrentStep } = useWizard();

  const [answers, setAnswers] = useState<Record<number, AnswerValue>>(
    state.locusAnswers ?? {}
  );
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const allAnswered = locusOfControlTest.questions.every((q) => answers[q.id]);

  const handleAnswer = (questionId: number, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    setAttempted(true);
    if (!allAnswered) return;
    setLocusAnswers(answers);
    router.push(WIZARD_STEPS[3].path);
  };

  const handleBack = () => {
    router.push(WIZARD_STEPS[1].path);
  };

  return (
    <WizardShell
      title={locusOfControlTest.title}
      subtitle={locusOfControlTest.subtitle}
      currentStep={2}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={attempted && !allAnswered}
    >
      <TestSection
        testConfig={locusOfControlTest}
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
