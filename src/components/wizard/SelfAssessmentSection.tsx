'use client';

import SliderScale from '@/components/ui/SliderScale';
import type { SelfAssessmentItem } from '@/types/test';

interface SelfAssessmentSectionProps {
  items: SelfAssessmentItem[];
  answers: Record<string, number>;
  onAnswer: (itemId: string, value: number) => void;
}

export default function SelfAssessmentSection({ items, answers, onAnswer }: SelfAssessmentSectionProps) {
  return (
    <div>
      <div className="bg-brand-lavender rounded-lg p-4 mb-6 text-sm">
        <p className="text-brand-dark">
          Per ogni affermazione, indica un valore da <strong>1</strong> (per nulla) a <strong>10</strong> (moltissimo)
          che meglio rappresenta la tua situazione attuale.
        </p>
      </div>

      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={item.id} className="p-4 rounded-lg border border-brand-gray-light/30">
            <p className="text-sm text-brand-charcoal mb-3">
              <span className="font-bold text-brand-purple mr-2">{idx + 1}.</span>
              {item.text}
            </p>
            <SliderScale
              value={answers[item.id]}
              onChange={(v) => onAnswer(item.id, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
