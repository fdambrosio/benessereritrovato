import type { TestConfig } from '@/types/test';

export const locusOfControlTest: TestConfig = {
  testId: 'locus-of-control',
  title: 'Test Locus of Control',
  subtitle: 'Come consideri la vita e il tuo ruolo nel determinarne gli eventi',
  instruction: 'Per ognuna delle affermazioni, seleziona una delle 4 risposte.',
  fullTestQuestionCount: 25,
  fullScoreRange: { min: 25, max: 100 },
  questions: [
    { id: 1, text: 'Sono convinto/a che per avere successo nella vita occorrano impegno e costanza', scoring: 'descending' },
    { id: 3, text: 'Considerato il ruolo del destino, molte volte ho la sensazione di avere poca influenza sulle cose che mi accadono', scoring: 'inverse' },
    { id: 4, text: 'Per avere una buona riuscita nell\'ambito professionale, più della fortuna, contano intelligenza e competenza', scoring: 'descending' },
    { id: 7, text: 'Credo che i miei successi, o insuccessi, siano dovuti in gran parte al mio comportamento e alle mie qualità personali', scoring: 'descending' },
    { id: 9, text: 'Credo che avere buoni amici sia tutta una questione di fortuna', scoring: 'inverse' },
    { id: 12, text: 'Sono convinto/a di aver sufficienti abilità per poter realizzare i miei progetti', scoring: 'descending' },
    { id: 14, text: 'Ciò che le persone raggiungono nella vita è sempre in funzione dell\'impegno che ci hanno messo', scoring: 'descending' },
    { id: 19, text: 'Generalmente faccio quello che ho deciso di fare senza farmi influenzare da pressioni esterne', scoring: 'descending' },
    { id: 21, text: 'Se riesco ad ottenere ciò che voglio è perché mi sono impegnato molto', scoring: 'descending' },
    { id: 25, text: 'A volte penso che la mia vita sia determinata in larga parte dal destino', scoring: 'inverse' },
  ],
  interpretations: [
    { minScore: 25, maxScore: 50, key: 'fatalismo', label: 'Tendenza al fatalismo', description: 'I risultati suggeriscono una propensione ad attribuire gli eventi della vita a fattori esterni come il destino, la fortuna o l\'influenza degli altri. Questo atteggiamento può limitare la percezione delle proprie capacità e il senso di iniziativa personale. Un percorso di consapevolezza potrebbe aiutarti a riscoprire le tue risorse interiori.' },
    { minScore: 51, maxScore: 79, key: 'equilibrio', label: 'Buon equilibrio', description: 'Mostri un buon equilibrio tra la consapevolezza dei fattori esterni e la fiducia nelle tue capacità personali. Riconosci che le tue azioni hanno un impatto sulla tua vita, pur mantenendo realismo rispetto ai fattori che non puoi controllare.' },
    { minScore: 80, maxScore: 100, key: 'controllo_forte', label: 'Forte senso di controllo', description: 'Dimostri una forte convinzione che le tue azioni e decisioni determinino i risultati della tua vita. Questo atteggiamento denota sicurezza e determinazione. È importante mantenere anche l\'apertura verso gli aspetti della vita che non dipendono esclusivamente da noi.' },
  ],
};
