'use client';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hasFrequency?: boolean;
  frequencyValue?: string;
  onFrequencyChange?: (value: string) => void;
  hasVariant?: boolean;
  variants?: string[];
  selectedVariant?: string;
  onVariantChange?: (value: string) => void;
  hasNumericInput?: boolean;
  numericLabel?: string;
  numericValue?: string;
  onNumericChange?: (value: string) => void;
}

export default function CheckboxItem({
  label, checked, onChange,
  hasFrequency, frequencyValue, onFrequencyChange,
  hasVariant, variants, selectedVariant, onVariantChange,
  hasNumericInput, numericLabel, numericValue, onNumericChange,
}: CheckboxItemProps) {
  return (
    <div className="flex flex-col gap-2 py-2 border-b border-brand-gray-light/30 last:border-0">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-brand-gray-light text-brand-purple focus:ring-brand-purple accent-brand-purple"
        />
        <span className="text-sm text-brand-charcoal">{label}</span>
      </label>

      {checked && (
        <div className="ml-7 flex flex-wrap items-center gap-3">
          {hasFrequency && onFrequencyChange && (
            <input
              type="text"
              value={frequencyValue || ''}
              onChange={(e) => onFrequencyChange(e.target.value)}
              placeholder="volte/settimana"
              className="w-32 px-2 py-1 text-xs border border-brand-gray-light rounded focus:border-brand-purple focus:outline-none"
            />
          )}
          {hasVariant && variants && onVariantChange && (
            <div className="flex gap-2">
              {variants.map((v) => (
                <label key={v} className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name={`variant-${label}`}
                    checked={selectedVariant === v}
                    onChange={() => onVariantChange(v)}
                    className="w-3 h-3 text-brand-purple accent-brand-purple"
                  />
                  {v}
                </label>
              ))}
            </div>
          )}
          {hasNumericInput && onNumericChange && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={numericValue || ''}
                onChange={(e) => onNumericChange(e.target.value)}
                className="w-16 px-2 py-1 text-xs border border-brand-gray-light rounded focus:border-brand-purple focus:outline-none"
                min="0"
              />
              {numericLabel && <span className="text-xs text-brand-gray-medium">{numericLabel}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
