'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="w-full mb-8">
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-brand-gray-medium">
            Passo {currentStep + 1} di {totalSteps}
          </span>
          <span className="text-sm font-medium text-brand-purple">{percentage}%</span>
        </div>
        <div className="w-full bg-brand-gray-light rounded-full h-2">
          <div
            className="bg-brand-purple h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center gap-0">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${i < currentStep
                  ? 'bg-brand-purple text-white'
                  : i === currentStep
                    ? 'bg-brand-purple text-white animate-pulse-ring'
                    : 'bg-brand-gray-light text-brand-gray-medium'
                }
              `}
            >
              {i < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-6 lg:w-10 h-0.5 ${i < currentStep ? 'bg-brand-purple' : 'bg-brand-gray-light'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
