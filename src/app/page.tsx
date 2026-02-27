import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-lavender via-white to-white">
        <div className="max-w-[645px] mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark font-[family-name:var(--font-platypi)] leading-tight">
              Scopri il tuo percorso<br />
              <span className="text-brand-purple">di benessere</span>
            </h1>
            <p className="mt-6 text-lg text-brand-gray-medium max-w-lg mx-auto leading-relaxed">
              Una consulenza preliminare gratuita e riservata per conoscere meglio te stesso
              e iniziare un percorso personalizzato verso il benessere psicofisico.
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
              Circa 10-15 minuti &middot; Completamente gratuita &middot; Risultati immediati
            </p>
          </div>
        </div>
      </div>

      {/* Come funziona */}
      <div className="max-w-[800px] mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-brand-dark text-center font-[family-name:var(--font-platypi)] mb-12">
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
      </div>

      {/* Footer disclaimer */}
      <div className="bg-brand-lavender/50 py-8">
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
          </p>
        </div>
      </div>
    </div>
  );
}
