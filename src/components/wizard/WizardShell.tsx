'use client';

import ProgressBar from '@/components/ui/ProgressBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { WIZARD_STEPS } from '@/types/wizard';

interface WizardShellProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function WizardShell({
  title, subtitle, currentStep, onBack, onNext,
  nextLabel = 'Avanti', nextDisabled, isLoading, children,
}: WizardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-12">
      <div className="max-w-[645px] mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={WIZARD_STEPS.length} />

        <Card>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-brand-gray-medium">{subtitle}</p>
            )}
          </div>

          <div className="mb-8">{children}</div>

          <div className="flex justify-between items-center pt-4 border-t border-brand-gray-light/30">
            {currentStep > 0 && onBack ? (
              <Button variant="secondary" onClick={onBack}>
                Indietro
              </Button>
            ) : (
              <div />
            )}
            {onNext && (
              <Button
                variant="primary"
                onClick={onNext}
                disabled={nextDisabled}
                loading={isLoading}
              >
                {nextLabel}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
