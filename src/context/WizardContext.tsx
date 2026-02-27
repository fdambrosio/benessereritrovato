'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AnswerValue } from '@/types/test';
import type { WizardState, PersonalData, LifestyleData } from '@/types/wizard';

const STORAGE_KEY = 'benessere-wizard-state';

const initialState: WizardState = {
  currentStep: 0,
  consent: null,
  personalData: null,
  locusAnswers: null,
  eventiSaluteAnswers: null,
  medicineAlternativeAnswers: null,
  leadershipAnswers: null,
  selfAssessmentAnswers: null,
  lifestyleData: null,
};

interface WizardContextType {
  state: WizardState;
  setConsent: (consent: { gdprAccepted: boolean; disclaimerAccepted: boolean }) => void;
  setPersonalData: (data: PersonalData) => void;
  setLocusAnswers: (answers: Record<number, AnswerValue>) => void;
  setEventiSaluteAnswers: (answers: Record<number, AnswerValue>) => void;
  setMedicineAlternativeAnswers: (answers: Record<number, AnswerValue>) => void;
  setLeadershipAnswers: (answers: Record<number, AnswerValue>) => void;
  setSelfAssessmentAnswers: (answers: Record<string, number>) => void;
  setLifestyleData: (data: LifestyleData) => void;
  setCurrentStep: (step: number) => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as WizardState;
        setState(parsed);
      }
    } catch {
      // Ignore errors
    }
    setHydrated(true);
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    if (hydrated) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore errors
      }
    }
  }, [state, hydrated]);

  const setConsent = useCallback((consent: { gdprAccepted: boolean; disclaimerAccepted: boolean }) => {
    setState(prev => ({ ...prev, consent }));
  }, []);

  const setPersonalData = useCallback((data: PersonalData) => {
    setState(prev => ({ ...prev, personalData: data }));
  }, []);

  const setLocusAnswers = useCallback((answers: Record<number, AnswerValue>) => {
    setState(prev => ({ ...prev, locusAnswers: answers }));
  }, []);

  const setEventiSaluteAnswers = useCallback((answers: Record<number, AnswerValue>) => {
    setState(prev => ({ ...prev, eventiSaluteAnswers: answers }));
  }, []);

  const setMedicineAlternativeAnswers = useCallback((answers: Record<number, AnswerValue>) => {
    setState(prev => ({ ...prev, medicineAlternativeAnswers: answers }));
  }, []);

  const setLeadershipAnswers = useCallback((answers: Record<number, AnswerValue>) => {
    setState(prev => ({ ...prev, leadershipAnswers: answers }));
  }, []);

  const setSelfAssessmentAnswers = useCallback((answers: Record<string, number>) => {
    setState(prev => ({ ...prev, selfAssessmentAnswers: answers }));
  }, []);

  const setLifestyleData = useCallback((data: LifestyleData) => {
    setState(prev => ({ ...prev, lifestyleData: data }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(initialState);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <WizardContext.Provider
      value={{
        state,
        setConsent,
        setPersonalData,
        setLocusAnswers,
        setEventiSaluteAnswers,
        setMedicineAlternativeAnswers,
        setLeadershipAnswers,
        setSelfAssessmentAnswers,
        setLifestyleData,
        setCurrentStep,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
