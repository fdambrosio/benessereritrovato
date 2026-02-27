import type { QuestionConfig, SelfAssessmentItem } from '@/types/test';

/**
 * 10 domande selezionate per la versione lite del questionario.
 * 8 ABCD (2 per area test) + 2 autovalutazione slider.
 * Criteri: 1 descending + 1 inverse per test, domande chiare e comprensibili.
 */

export interface LiteAbcdQuestion {
  testId: string;
  testLabel: string;
  question: QuestionConfig;
}

export const liteAbcdQuestions: LiteAbcdQuestion[] = [
  // Locus of Control (2)
  {
    testId: 'locus-of-control',
    testLabel: 'Autoefficacia',
    question: { id: 1, text: 'Sono convinto/a che per avere successo nella vita occorrano impegno e costanza', scoring: 'descending' },
  },
  {
    testId: 'locus-of-control',
    testLabel: 'Autoefficacia',
    question: { id: 25, text: 'A volte penso che la mia vita sia determinata in larga parte dal destino', scoring: 'inverse' },
  },
  // Eventi e Salute (2)
  {
    testId: 'eventi-salute',
    testLabel: 'Salute e Benessere',
    question: { id: 5, text: 'Credo di poter far molto per conservare una buona salute', scoring: 'descending' },
  },
  {
    testId: 'eventi-salute',
    testLabel: 'Salute e Benessere',
    question: { id: 8, text: 'La buona salute è in larga parte una questione di fortuna', scoring: 'inverse' },
  },
  // Medicine Alternative (2)
  {
    testId: 'medicine-alternative',
    testLabel: 'Medicine Alternative',
    question: { id: 4, text: 'Il fatto stesso che una certa terapia alternativa esista e sia praticata da decenni, secoli o addirittura millenni significa che è valida ed efficace', scoring: 'inverse' },
  },
  {
    testId: 'medicine-alternative',
    testLabel: 'Medicine Alternative',
    question: { id: 6, text: 'Non è vero che i rimedi naturali non hanno effetti collaterali e controindicazioni', scoring: 'descending' },
  },
  // Leadership (2)
  {
    testId: 'leadership',
    testLabel: 'Autonomia',
    question: { id: 11, text: 'Se sono convinto razionalmente di qualcosa, è difficile farmi cambiare idea e perseguo il mio scopo con determinazione', scoring: 'descending' },
  },
  {
    testId: 'leadership',
    testLabel: 'Autonomia',
    question: { id: 20, text: 'Senza l\'aiuto di persone esperte e competenti, è difficile costruire una vita conforme alle proprie esigenze e desideri', scoring: 'inverse' },
  },
];

export const liteSelfAssessmentItems: SelfAssessmentItem[] = [
  { id: 'stress', text: 'Sono stressato/a in generale', isNegative: true },
  { id: 'felicita', text: 'In generale mi considero una persona felice', isNegative: false },
];

/** Group lite ABCD questions by testId */
export function groupLiteQuestionsByTest(): Map<string, LiteAbcdQuestion[]> {
  const groups = new Map<string, LiteAbcdQuestion[]>();
  for (const q of liteAbcdQuestions) {
    const existing = groups.get(q.testId) ?? [];
    existing.push(q);
    groups.set(q.testId, existing);
  }
  return groups;
}
