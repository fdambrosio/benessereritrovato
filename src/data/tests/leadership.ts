import type { TestConfig } from '@/types/test';

export const leadershipTest: TestConfig = {
  testId: 'leadership',
  title: 'Test Leadership',
  subtitle: 'Il tuo atteggiamento nei confronti della vita sociale e decisionale',
  instruction: 'Per ognuna delle affermazioni, seleziona una delle 4 risposte.',
  fullTestQuestionCount: 20,
  fullScoreRange: { min: 20, max: 80 },
  questions: [
    { id: 1, text: 'Non credo che esporsi in pubblico sia un modo corretto e utile di illustrare le proprie idee e posizioni. Meglio lasciarlo fare a chi è competente in materia.', scoring: 'inverse' },
    { id: 5, text: 'Prendere una posizione contraria a quella della maggioranza è sempre pericoloso', scoring: 'inverse' },
    { id: 8, text: 'Mi trovo meglio in luoghi affollati e frequentati, che in quelli riservati, silenziosi e con poche persone', scoring: 'inverse' },
    { id: 11, text: 'Se sono convinto razionalmente di qualcosa, è difficile farmi cambiare idea e perseguo il mio scopo con determinazione', scoring: 'descending' },
    { id: 12, text: 'Il parere della maggioranza, nonostante tutto, è sempre quello cui fare riferimento', scoring: 'inverse' },
    { id: 16, text: 'Piuttosto che sbagliare copiando quello che fanno gli altri, preferisco sbagliare da solo', scoring: 'descending' },
    { id: 17, text: 'Quando si è affetti da qualche disturbo, cambiare alimentazione e stile di vita e fare attività fisica non basta. Ci vuole sempre un rimedio o una cura consigliati da un esperto.', scoring: 'inverse' },
    { id: 20, text: 'Senza l\'aiuto di persone esperte e competenti, è difficile costruire una vita conforme alle proprie esigenze e desideri', scoring: 'inverse' },
  ],
  interpretations: [
    { minScore: 20, maxScore: 40, key: 'tendenza_gregaria', label: 'Tendenza gregaria', description: 'I risultati suggeriscono una tendenza a cercare guida e approvazione negli altri. Potresti beneficiare di un percorso per rafforzare la fiducia in te stesso e nelle tue capacità decisionali, scoprendo le tue risorse interiori.' },
    { minScore: 41, maxScore: 60, key: 'consapevolezza', label: 'Consapevolezza in evoluzione', description: 'Sei consapevole delle tue qualità, ma alcune difficoltà passate o presenti possono aver indebolito la tua sicurezza. Un percorso mirato potrebbe aiutarti a recuperare piena fiducia nelle tue capacità.' },
    { minScore: 61, maxScore: 80, key: 'forte_indipendenza', label: 'Forte indipendenza', description: 'Dimostri una spiccata capacità di pensiero autonomo e determinazione nel perseguire i tuoi obiettivi. Apprezzi l\'indipendenza decisionale e hai fiducia nel tuo giudizio.' },
  ],
};
