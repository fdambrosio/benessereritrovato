import { z } from 'zod/v4';
import type { QuestionConfig, SelfAssessmentItem } from '@/types/test';

export const sixAAnswerSchema = z.enum(['A', 'B', 'C', 'D']);

export const sixAAnswersSchema = z.record(
  z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  sixAAnswerSchema,
);

export const sixASelfAssessmentSchema = z.strictObject({
  stress: z.number().int().min(1).max(10),
  felicita: z.number().int().min(1).max(10),
});

export const sixAOptions = [
  { value: 'A', label: 'Quasi sempre / Molto spesso' },
  { value: 'B', label: 'Spesso' },
  { value: 'C', label: 'Raramente' },
  { value: 'D', label: 'Quasi mai / Mai' },
];

export const sixAAreas: { id: string; label: string; questions: QuestionConfig[] }[] = [
  {
    id: 'alimentazione',
    label: 'Alimentazione',
    questions: [
      { id: 1, text: 'Sento che le mie scelte alimentari sono spesso guidate dalla fretta o dallo stress emotivo piuttosto che dal reale appetito.', scoring: 'inverse' },
      { id: 2, text: "Riesco a mantenere un'alimentazione regolare, varia e consapevole durante la settimana, senza rigidità eccessive.", scoring: 'descending' },
    ],
  },
  {
    id: 'attivita-fisica',
    label: 'Attività Fisica',
    questions: [
      { id: 3, text: 'Sento il corpo rigido, stanco o privo della giusta energia per affrontare le giornate con vitalità.', scoring: 'inverse' },
      { id: 4, text: 'Dedico regolarmente del tempo a muovere il corpo per scaricare le tensioni accumulate, trovando continuità.', scoring: 'descending' },
    ],
  },
  {
    id: 'atteggiamento-mentale',
    label: 'Atteggiamento Mentale (Emozioni e Stress)',
    questions: [
      { id: 5, text: 'La mia mente è spesso affollata da pensieri continui, preoccupazioni lavorative o autocritica che fatico a spegnere.', scoring: 'inverse' },
      { id: 6, text: 'Ho strumenti pratici e momenti di pausa efficaci per ritrovare la calma nei momenti di sovraccarico emotivo.', scoring: 'descending' },
    ],
  },
  {
    id: 'attivita-mentale',
    label: 'Attività Mentale (Focus e Igiene Digitale)',
    questions: [
      { id: 7, text: 'Mi ritrovo spesso a consumare tempo ed energia in modo passivo (es. scrolling compulsivo, distrazioni digitali) invece di nutrire la mente con stimoli di valore.', scoring: 'inverse' },
      { id: 8, text: 'Riesco a proteggere il mio tempo di attenzione profonda e a dedicare spazio ad attività che mantengono la mente lucida e allenata.', scoring: 'descending' },
    ],
  },
  {
    id: 'ambiente',
    label: 'Ambiente',
    questions: [
      { id: 9, text: 'I ritmi della mia giornata e gli spazi in cui vivo o lavoro alimentano un senso costante di caos e urgenza.', scoring: 'inverse' },
      { id: 10, text: 'Riesco a stabilire confini chiari per proteggere il mio tempo, il riposo e la mia quiete personale.', scoring: 'descending' },
    ],
  },
  {
    id: 'affettivita-relazioni',
    label: 'Affettività e Relazioni',
    questions: [
      { id: 11, text: 'Sento che alcune relazioni o contesti attuali prosciugano le mie energie anziché nutrirmi.', scoring: 'inverse' },
      { id: 12, text: 'Riesco a comunicare i miei bisogni reali agli altri senza avvertire sensi di colpa.', scoring: 'descending' },
    ],
  },
];

export const sixASelfAssessmentItems: SelfAssessmentItem[] = [
  { id: 'stress', text: 'Complessivamente, in questo periodo mi sento stressato/a.', isNegative: true },
  { id: 'felicita', text: 'In generale mi considero una persona felice e appagata.', isNegative: false },
];
