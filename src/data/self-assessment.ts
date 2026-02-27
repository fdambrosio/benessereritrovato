import type { SelfAssessmentItem } from '@/types/test';

export const selfAssessmentItems: SelfAssessmentItem[] = [
  { id: 'preoccupazione', text: 'Sono generalmente preoccupato/a', isNegative: true },
  { id: 'stress', text: 'Sono stressato/a in generale', isNegative: true },
  { id: 'felicita', text: 'In generale mi considero una persona felice', isNegative: false },
  { id: 'salute_fisica', text: 'Mi sento in buona salute fisicamente', isNegative: false },
  { id: 'salute_mentale', text: 'Mi sento in buona salute mentalmente', isNegative: false },
  { id: 'sicurezza_capacita', text: 'Sono sicuro/a delle mie capacità', isNegative: false },
  { id: 'rilassamento', text: 'Sono capace a lasciare andare le tensioni e a rilassarmi', isNegative: false },
  { id: 'fiducia_vita', text: 'Ho fiducia nella mia vita', isNegative: false },
  { id: 'realizzazione', text: 'Mi sento realizzato/a', isNegative: false },
  { id: 'scopo_vita', text: 'Ho uno scopo nella vita', isNegative: false },
];
