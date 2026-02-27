'use client';

import RadioGroup from '@/components/ui/RadioGroup';
import type { TestConfig, AnswerValue } from '@/types/test';

interface TestSectionProps {
  testConfig: TestConfig;
  answers: Record<number, AnswerValue>;
  onAnswer: (questionId: number, value: AnswerValue) => void;
  attempted?: boolean;
}

const ANSWER_OPTIONS = [
  { value: 'A', label: 'Completamente vero' },
  { value: 'B', label: 'Abbastanza vero' },
  { value: 'C', label: 'Abbastanza falso' },
  { value: 'D', label: 'Completamente falso' },
];

export default function TestSection({ testConfig, answers, onAnswer, attempted = false }: TestSectionProps) {
  return (
    <div>
      <div className="bg-brand-lavender rounded-lg p-4 mb-6 text-sm">
        <p className="font-medium text-brand-dark mb-2">{testConfig.instruction}</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-brand-gray-medium">
          <span><strong>A</strong> = Completamente vero</span>
          <span><strong>B</strong> = Abbastanza vero</span>
          <span><strong>C</strong> = Abbastanza falso</span>
          <span><strong>D</strong> = Completamente falso</span>
        </div>
      </div>

      <div className="space-y-6">
        {testConfig.questions.map((q, idx) => (
          <div
            key={q.id}
            className={`p-4 rounded-lg border transition-colors ${
              attempted && !answers[q.id]
                ? 'border-red-400 bg-red-50'
                : 'border-brand-gray-light/30'
            }`}
          >
            <p className="text-sm text-brand-charcoal mb-3">
              <span className="font-bold text-brand-purple mr-2">{idx + 1}.</span>
              {q.text}
            </p>
            <RadioGroup
              name={`q-${testConfig.testId}-${q.id}`}
              value={answers[q.id]}
              onChange={(v) => onAnswer(q.id, v as AnswerValue)}
              options={ANSWER_OPTIONS}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
