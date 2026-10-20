'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import type { PersonalData } from '@/types/wizard';

const emptyForm: PersonalData = { nome: '' };

export default function DatiPersonaliPage() {
  const router = useRouter();
  const { state, setPersonalData, setCurrentStep } = useWizard();

  const [form, setForm] = useState<PersonalData>(state.personalData ?? emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const updateField = (field: keyof PersonalData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalData, string>> = {};
    if (!form.nome.trim()) newErrors.nome = 'Il nome è obbligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setPersonalData(form);
    router.push(WIZARD_STEPS[2].path);
  };

  const handleBack = () => {
    router.push(WIZARD_STEPS[0].path);
  };

  const inputClass = (field: keyof PersonalData) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-brand-gray-light focus:border-brand-purple'
    }`;

  return (
    <WizardShell
      title="Dati Personali"
      subtitle="Inserisci il tuo nome: ci serve solo per personalizzare il tuo profilo di benessere."
      currentStep={1}
      onBack={handleBack}
      onNext={handleNext}
    >
      <div>
        <label className="block text-sm font-medium text-brand-charcoal mb-1">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => updateField('nome', e.target.value)}
          className={inputClass('nome')}
          placeholder="Il tuo nome"
        />
        {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
      </div>
    </WizardShell>
  );
}
