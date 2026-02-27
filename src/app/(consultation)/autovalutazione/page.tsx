'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import SelfAssessmentSection from '@/components/wizard/SelfAssessmentSection';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import { selfAssessmentItems } from '@/data/self-assessment';

export default function AutovalutazionePage() {
  const router = useRouter();
  const { state, setSelfAssessmentAnswers, setCurrentStep } = useWizard();

  const [answers, setAnswers] = useState<Record<string, number>>(
    state.selfAssessmentAnswers ?? {}
  );
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setCurrentStep(6);
  }, [setCurrentStep]);

  const allAnswered = selfAssessmentItems.every((item) => answers[item.id] !== undefined);

  const handleAnswer = (itemId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleNext = () => {
    setAttempted(true);
    if (!allAnswered) return;
    setSelfAssessmentAnswers(answers);
    router.push(WIZARD_STEPS[7].path);
  };

  const handleBack = () => {
    router.push(WIZARD_STEPS[5].path);
  };

  return (
    <WizardShell
      title="Autovalutazione del Benessere"
      subtitle="Valuta come ti senti rispetto a ciascuna affermazione."
      currentStep={6}
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={attempted && !allAnswered}
    >
      <SelfAssessmentSection
        items={selfAssessmentItems}
        answers={answers}
        onAnswer={handleAnswer}
      />
      {attempted && !allAnswered && (
        <p className="mt-4 text-sm text-red-500">
          Rispondi a tutte le domande prima di procedere.
        </p>
      )}
    </WizardShell>
  );
}
