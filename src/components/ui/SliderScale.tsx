'use client';

interface SliderScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function SliderScale({ value, onChange, min = 1, max = 10 }: SliderScaleProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
      {numbers.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer
            ${value === num
              ? 'bg-brand-purple text-white scale-110'
              : 'border border-brand-gray-light text-brand-charcoal hover:border-brand-purple'
            }
          `}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
