'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/wizard/WizardShell';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import type { PersonalData } from '@/types/wizard';

const emptyForm: PersonalData = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  eta: '',
  peso: '',
  altezza: '',
  citta: '',
};

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
    if (!form.cognome.trim()) newErrors.cognome = 'Il cognome è obbligatorio';
    if (!form.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }
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
      subtitle="Inserisci i tuoi dati. I campi contrassegnati con * sono obbligatori."
      currentStep={1}
      onBack={handleBack}
      onNext={handleNext}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1">
              Cognome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.cognome}
              onChange={(e) => updateField('cognome', e.target.value)}
              className={inputClass('cognome')}
              placeholder="Il tuo cognome"
            />
            {errors.cognome && <p className="text-xs text-red-500 mt-1">{errors.cognome}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={inputClass('email')}
            placeholder="la-tua@email.it"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1">Telefono</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={(e) => updateField('telefono', e.target.value)}
            className={inputClass('telefono')}
            placeholder="Numero di telefono"
          />
        </div>
      </div>
    </WizardShell>
  );
}
