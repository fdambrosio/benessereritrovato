'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import TestSection from '@/components/wizard/TestSection';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import { leadershipTest } from '@/data/tests/leadership';
import type { AnswerValue } from '@/types/test';

export default function LeadershipPage() {
  const router = useRouter();
  const { state, setLeadershipAnswers, setCurrentStep } = useWizard();

  const [answers, setAnswers] = useState<Record<number, AnswerValue>>(
    state.leadershipAnswers ?? {}
  );
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  const allAnswered = leadershipTest.questions.every((q) => answers[q.id]);

  const handleAnswer = (questionId: number, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    setAttempted(true);
    if (!allAnswered) return;
    setLeadershipAnswers(answers);
    router.push(WIZARD_STEPS[6].path);
  };

  const handleBack = () => {
    router.push(WIZARD_STEPS[4].path);
  };

  return (
    <WizardShell
      title={leadershipTest.title}
      subtitle={leadershipTest.subtitle}
      currentStep={5}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={attempted && !allAnswered}
    >
      <TestSection
        testConfig={leadershipTest}
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
