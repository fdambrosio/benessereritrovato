import { AnswerValue } from './test';

export interface PersonalData {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  eta: string;
  peso: string;
  altezza: string;
  citta: string;
}

export interface LifestyleData {
  foodHabits: Record<string, { checked: boolean; frequency: string; variant?: string }>;
  lifestyleIndicators: Record<string, { checked: boolean; numericValue?: string }>;
  dailyDiet: {
    colazione: string;
    spuntino: string;
    pranzo: string;
    merenda: string;
    cena: string;
    dopocena: string;
    fuoripasto: string;
  };
  noteAggiuntive: string;
}

export interface WizardState {
  currentStep: number;
  consent: { gdprAccepted: boolean; disclaimerAccepted: boolean } | null;
  personalData: PersonalData | null;
  locusAnswers: Record<number, AnswerValue> | null;
  eventiSaluteAnswers: Record<number, AnswerValue> | null;
  medicineAlternativeAnswers: Record<number, AnswerValue> | null;
  leadershipAnswers: Record<number, AnswerValue> | null;
  selfAssessmentAnswers: Record<string, number> | null;
  lifestyleData: LifestyleData | null;
}

export const WIZARD_STEPS = [
  { path: '/consenso', label: 'Consenso', shortLabel: 'Consenso' },
  { path: '/dati-personali', label: 'Dati Personali', shortLabel: 'Dati' },
  { path: '/locus-of-control', label: 'Locus of Control', shortLabel: 'Locus' },
  { path: '/eventi-salute', label: 'Eventi e Salute', shortLabel: 'Salute' },
  { path: '/medicine-alternative', label: 'Medicine Alternative', shortLabel: 'Medicine' },
  { path: '/leadership', label: 'Leadership', shortLabel: 'Leadership' },
  { path: '/autovalutazione', label: 'Autovalutazione', shortLabel: 'Autoval.' },
  { path: '/stile-di-vita', label: 'Stile di Vita', shortLabel: 'Stile' },
  { path: '/risultati', label: 'Risultati', shortLabel: 'Risultati' },
] as const;
