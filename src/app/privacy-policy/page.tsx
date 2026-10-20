import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informativa sulla Privacy',
  description: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) - Il Benessere Ritrovato',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[800px] mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark font-[family-name:var(--font-platypi)] mb-8">
          Informativa sulla Privacy
        </h1>
        <p className="text-sm text-brand-gray-medium mb-8">
          Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR)
        </p>

        <div className="prose prose-sm max-w-none space-y-8 text-brand-charcoal">
          {/* 1. Titolare */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              1. Titolare del trattamento
            </h2>
            <p>
              Il Titolare del trattamento dei dati personali è la <strong>Dott.ssa Roberta Loprieno</strong>,
              professionista in discipline del benessere, contattabile all&apos;indirizzo email:{' '}
              <a href="mailto:consulenza@ilbenessereritrovato.it" className="text-brand-purple hover:underline">
                consulenza@ilbenessereritrovato.it
              </a>
            </p>
          </section>

          {/* 2. Finalità */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              2. Finalità del trattamento
            </h2>
            <p>I dati personali forniti dall&apos;utente vengono trattati per le seguenti finalità:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Erogazione della consulenza preliminare di benessere psicofisico</li>
              <li>Analisi delle risposte ai questionari di autovalutazione</li>
              <li>Elaborazione e restituzione dei risultati personalizzati</li>
              <li>Eventuale contatto per approfondimenti sulla consulenza, solo su richiesta dell&apos;utente</li>
            </ul>
          </section>

          {/* 3. Base giuridica */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              3. Base giuridica del trattamento
            </h2>
            <p>Il trattamento dei dati personali si basa su:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Art. 6, par. 1, lett. a) GDPR</strong> – Consenso dell&apos;interessato per il trattamento
                dei dati identificativi e anagrafici
              </li>
              <li>
                <strong>Art. 9, par. 2, lett. a) GDPR</strong> – Consenso esplicito dell&apos;interessato per il
                trattamento di categorie particolari di dati (dati relativi alla salute e al benessere psicofisico)
              </li>
            </ul>
          </section>

          {/* 4. Dati raccolti */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              4. Tipologie di dati raccolti
            </h2>
            <p>Nell&apos;ambito della consulenza vengono raccolti i seguenti dati:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dati identificativi:</strong> nome, cognome, indirizzo email, numero di telefono (facoltativo)</li>
              <li><strong>Dati anagrafici:</strong> età, peso, altezza, città di residenza</li>
              <li><strong>Risposte ai questionari:</strong> questionari di autovalutazione su atteggiamento verso la salute, locus of control, medicine alternative, leadership</li>
              <li><strong>Dati sullo stile di vita:</strong> abitudini alimentari, indicatori di stile di vita, dieta giornaliera (nella versione completa)</li>
            </ul>
          </section>

          {/* 5. Conservazione */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              5. Periodo di conservazione
            </h2>
            <p>
              I dati personali saranno conservati per un periodo massimo di <strong>24 mesi</strong> dalla data
              di compilazione della consulenza, al termine del quale verranno cancellati in modo sicuro,
              salvo diversi obblighi di legge.
            </p>
          </section>

          {/* 6. Destinatari */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              6. Destinatari dei dati
            </h2>
            <p>
              I dati personali non saranno comunicati a terzi né diffusi, salvo obblighi previsti dalla legge.
              I dati potranno essere trattati dal fornitore del servizio di hosting in qualità di
              Responsabile del trattamento, ai sensi dell&apos;art. 28 del GDPR.
            </p>
          </section>

          {/* 7. Diritti */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              7. Diritti dell&apos;interessato
            </h2>
            <p>In qualità di interessato, l&apos;utente ha il diritto di:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Accesso</strong> (Art. 15 GDPR) – Ottenere conferma dell&apos;esistenza di un trattamento e accedere ai propri dati</li>
              <li><strong>Rettifica</strong> (Art. 16 GDPR) – Ottenere la correzione di dati inesatti</li>
              <li><strong>Cancellazione</strong> (Art. 17 GDPR) – Ottenere la cancellazione dei propri dati (&quot;diritto all&apos;oblio&quot;)</li>
              <li><strong>Limitazione</strong> (Art. 18 GDPR) – Ottenere la limitazione del trattamento</li>
              <li><strong>Portabilità</strong> (Art. 20 GDPR) – Ricevere i propri dati in formato strutturato e leggibile</li>
              <li><strong>Opposizione</strong> (Art. 21 GDPR) – Opporsi al trattamento dei propri dati</li>
              <li><strong>Revoca del consenso</strong> – Il consenso può essere revocato in qualsiasi momento senza pregiudicare la liceità del trattamento basato sul consenso prestato prima della revoca</li>
            </ul>
            <p className="mt-4">
              Per esercitare i propri diritti, è possibile contattare il Titolare all&apos;indirizzo:{' '}
              <a href="mailto:consulenza@ilbenessereritrovato.it" className="text-brand-purple hover:underline">
                consulenza@ilbenessereritrovato.it
              </a>
            </p>
            <p className="mt-2">
              L&apos;interessato ha inoltre il diritto di proporre reclamo all&apos;Autorità Garante per la Protezione
              dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">www.garanteprivacy.it</a>).
            </p>
          </section>

          {/* 8. Cookie */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              8. Cookie
            </h2>
            <p>
              Questo sito utilizza esclusivamente <strong>cookie tecnici</strong> necessari al funzionamento
              del servizio (ad esempio per la gestione della sessione di navigazione).
            </p>
            <p className="mt-2">
              I cookie analitici di terze parti (Google Analytics) vengono installati
              solo previo <strong>consenso esplicito</strong> dell&apos;utente tramite il banner cookie.
              Non vengono effettuate attività di profilazione dell&apos;utente.
            </p>
          </section>

          {/* 9. Aggiornamento */}
          <section>
            <h2 className="text-xl font-semibold text-brand-dark font-[family-name:var(--font-platypi)]">
              9. Aggiornamento dell&apos;informativa
            </h2>
            <p>
              La presente informativa può essere soggetta ad aggiornamenti. L&apos;utente è invitato a consultare
              periodicamente questa pagina per verificare eventuali modifiche.
            </p>
            <p className="mt-2 text-sm text-brand-gray-medium">
              Ultimo aggiornamento: Febbraio 2026
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-brand-gray-light/30">
          <a href="/" className="text-brand-purple hover:underline text-sm">
            &larr; Torna alla home
          </a>
        </div>
      </div>
    </main>
  );
}
