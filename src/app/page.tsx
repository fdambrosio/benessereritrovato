import Link from 'next/link';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HealthAndBeautyBusiness',
      name: 'Il Benessere Ritrovato',
      description: 'Consulenza preliminare gratuita per il benessere psicofisico. Test psicobiologici personalizzati e percorsi di benessere con la Dott.ssa Roberta Loprieno.',
      url: 'https://www.ilbenessereritrovato.it',
      founder: {
        '@type': 'Person',
        name: 'Dott.ssa Roberta Loprieno',
        jobTitle: 'Naturopata',
      },
      email: 'consulenza@ilbenessereritrovato.it',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Come funziona la consulenza?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La consulenza si svolge in tre fasi: rispondi a una serie di questionari online, ricevi un profilo personalizzato con grafici e interpretazioni, e se lo desideri puoi prenotare un approfondimento con la Dott.ssa Loprieno.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quanto costa la consulenza preliminare?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La consulenza preliminare online è completamente gratuita e richiede circa 3 minuti.',
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section aria-label="Introduzione alla consulenza" className="relative overflow-hidden bg-gradient-to-br from-brand-lavender via-background to-background">
        <div className="max-w-[645px] mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark font-[family-name:var(--font-platypi)] leading-tight">
              Dove si incastra la tua energia?<br />
              <span className="text-brand-purple">Scoprilo con il Test delle 6A</span>
            </h1>
            <p className="mt-6 text-lg text-brand-gray-medium max-w-lg mx-auto leading-relaxed">
              Scopri in 3 minuti dove stai perdendo energia e da quale area ripartire per ritrovare la tua chiarezza e vitalità
            </p>

            <div className="mt-10">
              <Link
                href="/consenso"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-brand-purple rounded-lg hover:bg-brand-purple-dark transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
              >
                Inizia la consulenza gratuita
              </Link>
            </div>

            <p className="mt-4 text-sm text-brand-gray-medium">
              Circa 3 minuti &middot; Completamente gratuita &middot; Risultati immediati
            </p>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" aria-labelledby="come-funziona-heading" className="max-w-[800px] mx-auto px-4 py-16">
        <h2 id="come-funziona-heading" className="text-2xl font-semibold text-brand-dark text-center font-[family-name:var(--font-platypi)] mb-12">
          Come funziona
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Rispondi ai questionari',
              desc: 'Una serie di domande per esplorare il tuo atteggiamento verso la vita, la salute e il benessere.',
            },
            {
              step: '2',
              title: 'Ricevi il tuo profilo',
              desc: 'Un\'analisi immediata con grafici e interpretazioni personalizzate dei tuoi risultati.',
            },
            {
              step: '3',
              title: 'Approfondisci con noi',
              desc: 'Se lo desideri, prenota una consulenza personalizzata con la Dott.ssa Loprieno.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-brand-purple text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-brand-dark mb-2">{item.title}</h3>
              <p className="text-sm text-brand-gray-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer disclaimer */}
      <footer className="bg-brand-lavender/50 py-8">
        <div className="max-w-[645px] mx-auto px-4 text-center">
          <p className="text-xs text-brand-gray-medium leading-relaxed">
            Questa consulenza preliminare non ha finalit&agrave; terapeutiche di tipo medico o psicologico.
            Le indicazioni fornite vanno sottoposte alla valutazione del medico curante.
          </p>
          <p className="mt-3 text-xs text-brand-gray-medium">
            <a href="https://www.ilbenessereritrovato.it/" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">
              Il Benessere Ritrovato
            </a>
            {' '}&middot; Dott.ssa Roberta Loprieno
            {' '}&middot;{' '}
            <a href="/privacy-policy" className="text-brand-purple hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
