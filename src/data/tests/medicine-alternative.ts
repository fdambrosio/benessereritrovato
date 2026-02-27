import type { TestConfig } from '@/types/test';

export const medicineAlternativeTest: TestConfig = {
  testId: 'medicine-alternative',
  title: 'Conoscenza delle Medicine Alternative',
  subtitle: 'Come consideri la validità ed efficacia delle medicine alternative',
  instruction: 'Per ognuna delle affermazioni, seleziona una delle 4 risposte.',
  fullTestQuestionCount: 20,
  fullScoreRange: { min: 20, max: 80 },
  questions: [
    { id: 1, text: 'Non credo che le medicine alternative abbiano un serio fondamento scientifico', scoring: 'descending' },
    { id: 4, text: 'Il fatto stesso che una certa terapia alternativa esista e sia praticata da decenni, secoli o addirittura millenni significa che è valida ed efficace', scoring: 'inverse' },
    { id: 6, text: 'Non è vero che i rimedi naturali non hanno effetti collaterali e controindicazioni', scoring: 'descending' },
    { id: 9, text: 'La scienza non riconosce le medicine alternative per ristrettezza di vedute e per interessi economici contrari', scoring: 'inverse' },
    { id: 11, text: 'L\'omeopatia e l\'agopuntura non sono specializzazioni mediche e non sono insegnate presso le facoltà di medicina', scoring: 'descending' },
    { id: 14, text: 'I test sulle intolleranze effettuati con Vega test o simili rilevano con una certa sicurezza intolleranze e allergie', scoring: 'inverse' },
    { id: 16, text: 'Non esistono studi e ricerche scientifiche che dimostrano l\'efficacia dei rimedi naturali inequivocabilmente', scoring: 'descending' },
    { id: 19, text: 'Compito della medicina alternativa è individuare il rimedio o i rimedi adatti al nostro singolo caso, modificando il meno possibile le nostre abitudini', scoring: 'inverse' },
  ],
  interpretations: [
    { minScore: 20, maxScore: 40, key: 'approccio_acritico', label: 'Approccio acritico', description: 'I risultati indicano una tendenza ad accettare le informazioni sulle medicine alternative senza un adeguato spirito critico. Potrebbe essere utile approfondire le basi scientifiche delle diverse pratiche per fare scelte più consapevoli per il proprio benessere.' },
    { minScore: 41, maxScore: 60, key: 'spirito_critico', label: 'Spirito critico moderato', description: 'Mostri un discreto equilibrio tra apertura verso le medicine alternative e capacità critica. Hai gli strumenti culturali per valutare le informazioni, ma potresti beneficiare di un approfondimento guidato.' },
    { minScore: 61, maxScore: 80, key: 'approccio_informato', label: 'Approccio critico e informato', description: 'Dimostri un buon livello di conoscenza e spirito critico riguardo alle medicine alternative. Il tuo approccio è razionale e basato su una valutazione consapevole delle evidenze.' },
  ],
};
