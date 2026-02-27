'use client';

interface RadioGroupProps {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  error?: boolean;
}

export default function RadioGroup({ name, value, onChange, options, disabled, error }: RadioGroupProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${error ? 'ring-2 ring-red-400 rounded-lg p-1' : ''}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all text-sm font-medium select-none
            ${value === option.value
              ? 'bg-brand-purple text-white border-brand-purple'
              : 'border-brand-gray-light text-brand-charcoal hover:border-brand-purple'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
            className="sr-only"
          />
          <span className="font-bold">{option.value}</span>
          <span className="hidden sm:inline text-xs">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
