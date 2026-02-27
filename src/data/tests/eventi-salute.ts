import type { TestConfig } from '@/types/test';

export const eventiSaluteTest: TestConfig = {
  testId: 'eventi-salute',
  title: 'Controllo degli Eventi e Salute',
  subtitle: 'Come consideri la salute e il benessere fisico',
  instruction: 'Per ognuna delle affermazioni, seleziona una delle 4 risposte.',
  fullTestQuestionCount: 18,
  fullScoreRange: { min: 18, max: 72 },
  questions: [
    { id: 2, text: 'Quando mi sento male fisicamente spesso dipende dall\'essermi trascurato/a', scoring: 'descending' },
    { id: 3, text: 'Se ho cura di me stesso posso evitare le malattie', scoring: 'descending' },
    { id: 5, text: 'Credo di poter far molto per conservare una buona salute', scoring: 'descending' },
    { id: 8, text: 'La buona salute è in larga parte una questione di fortuna', scoring: 'inverse' },
    { id: 9, text: 'Sono convinto/a che seguendo sane abitudini di vita starò bene', scoring: 'descending' },
    { id: 11, text: 'La cattiva salute delle persone spesso dipende dalla loro trascuratezza', scoring: 'descending' },
    { id: 16, text: 'La maggior parte delle persone non immagina quanto la loro salute sia influenzata dal loro modo di pensare e di agire', scoring: 'descending' },
    { id: 18, text: 'Ci sono così tante malattie che, indipendentemente dalle precauzioni che si possono prendere, è inevitabile ammalarsi', scoring: 'inverse' },
  ],
  interpretations: [
    { minScore: 18, maxScore: 30, key: 'scarso_controllo', label: 'Scarso controllo percepito', description: 'Tendi a percepire la salute come qualcosa che dipende principalmente da fattori esterni o dalla fortuna. Questo atteggiamento può ridurre la motivazione a prendersi cura attivamente del proprio benessere. Esplorare come le tue scelte quotidiane influenzano la tua salute potrebbe essere un primo passo importante.' },
    { minScore: 31, maxScore: 50, key: 'equilibrio', label: 'Equilibrio consapevole', description: 'Mostri un equilibrio sano tra la consapevolezza che la salute dipende anche dalle proprie scelte e il riconoscimento che esistono fattori non controllabili. Questo atteggiamento favorisce un approccio proattivo ma realistico al benessere.' },
    { minScore: 51, maxScore: 72, key: 'forte_responsabilita', label: 'Forte responsabilità personale', description: 'Dimostri una forte convinzione che la tua salute dipenda dalle tue scelte e comportamenti. Questo atteggiamento è molto positivo per intraprendere un percorso di benessere consapevole e proattivo.' },
  ],
};
