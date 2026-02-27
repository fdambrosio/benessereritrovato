import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { logoutAction, updateNotesAction, toggleViewedAction } from '../../actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const submission = await prisma.submission.findUnique({ where: { id } });

  if (!submission) notFound();

  // Auto-mark as viewed
  if (!submission.adminViewed) {
    await prisma.submission.update({ where: { id }, data: { adminViewed: true } });
  }

  const lifestyle = JSON.parse(submission.lifestyleAnswers || '{}');
  const selfAssessment = JSON.parse(submission.selfAssessmentAnswers || '{}');

  const tests = [
    { name: 'Locus of Control', raw: submission.locusScore, norm: submission.locusNormalized, interp: submission.locusInterpretation, range: '25-100' },
    { name: 'Eventi e Salute', raw: submission.eventiSaluteScore, norm: submission.eventiSaluteNormalized, interp: submission.eventiInterpretation, range: '18-72' },
    { name: 'Medicine Alternative', raw: submission.medicineAlternativeScore, norm: submission.medicineAlternativeNormalized, interp: submission.medicineInterpretation, range: '20-80' },
    { name: 'Leadership', raw: submission.leadershipScore, norm: submission.leadershipNormalized, interp: submission.leadershipInterpretation, range: '20-80' },
  ];

  const selfAssessmentLabels: Record<string, string> = {
    preoccupazione: 'Preoccupazione',
    stress: 'Stress',
    felicita: 'Felicità',
    salute_fisica: 'Salute fisica',
    salute_mentale: 'Salute mentale',
    sicurezza_capacita: 'Sicurezza capacità',
    rilassamento: 'Rilassamento',
    fiducia_vita: 'Fiducia nella vita',
    realizzazione: 'Realizzazione',
    scopo_vita: 'Scopo nella vita',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-brand-purple hover:underline"
            >
              &larr; Dashboard
            </Link>
            <h1 className="text-lg font-bold text-brand-dark">
              {submission.nome} {submission.cognome}
            </h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-brand-gray-medium hover:text-brand-dark transition-colors"
            >
              Esci
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Personal Data */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Dati Personali</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-brand-gray-medium">Nome:</span> <strong>{submission.nome}</strong></div>
            <div><span className="text-brand-gray-medium">Cognome:</span> <strong>{submission.cognome}</strong></div>
            <div><span className="text-brand-gray-medium">Email:</span> <strong>{submission.email}</strong></div>
            <div><span className="text-brand-gray-medium">Telefono:</span> <strong>{submission.telefono || '—'}</strong></div>
            <div><span className="text-brand-gray-medium">Età:</span> <strong>{submission.eta ?? '—'}</strong></div>
            <div><span className="text-brand-gray-medium">Peso:</span> <strong>{submission.peso ? `${submission.peso} kg` : '—'}</strong></div>
            <div><span className="text-brand-gray-medium">Altezza:</span> <strong>{submission.altezza ? `${submission.altezza} cm` : '—'}</strong></div>
            <div><span className="text-brand-gray-medium">Città:</span> <strong>{submission.citta || '—'}</strong></div>
          </div>
          <div className="mt-3 text-xs text-brand-gray-medium">
            Compilato il {new Date(submission.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </section>

        {/* Test Scores */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Punteggi Test</h2>
          <div className="space-y-4">
            {tests.map((t) => (
              <div key={t.name} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-brand-charcoal">{t.name}</h3>
                  <span className="text-sm text-brand-gray-medium">
                    Raw: {t.raw.toFixed(1)} | Norm: {t.norm.toFixed(1)} ({t.range})
                  </span>
                </div>
                <p className="text-sm text-brand-purple font-medium">{t.interp}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Self Assessment */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-1">Autovalutazione</h2>
          <p className="text-sm text-brand-gray-medium mb-4">
            Media: <strong>{submission.selfAssessmentAverage.toFixed(1)}</strong> / 10
          </p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(selfAssessment as Record<string, number>).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 px-2 rounded bg-gray-50">
                <span className="text-brand-charcoal">{selfAssessmentLabels[key] || key}</span>
                <span className="font-medium text-brand-dark">{value}/10</span>
              </div>
            ))}
          </div>
        </section>

        {/* Lifestyle */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Stile di Vita</h2>

          {lifestyle.foodHabits && (
            <div className="mb-4">
              <h3 className="font-medium text-brand-charcoal mb-2 text-sm">Abitudini Alimentari</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(lifestyle.foodHabits as Record<string, { checked: boolean; frequency: string; variant?: string }>)
                  .filter(([, v]) => v.checked)
                  .map(([key, v]) => (
                    <div key={key} className="flex items-center gap-2 py-1 px-2 rounded bg-gray-50">
                      <span className="text-brand-charcoal">{key}</span>
                      {v.frequency && <span className="text-xs text-brand-gray-medium">({v.frequency})</span>}
                      {v.variant && <span className="text-xs text-brand-purple">{v.variant}</span>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {lifestyle.lifestyleIndicators && (
            <div className="mb-4">
              <h3 className="font-medium text-brand-charcoal mb-2 text-sm">Indicatori</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(lifestyle.lifestyleIndicators as Record<string, { checked: boolean; numericValue?: string }>)
                  .filter(([, v]) => v.checked)
                  .map(([key, v]) => (
                    <div key={key} className="flex items-center gap-2 py-1 px-2 rounded bg-gray-50">
                      <span className="text-brand-charcoal">{key}</span>
                      {v.numericValue && <span className="text-xs text-brand-gray-medium">({v.numericValue})</span>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {lifestyle.dailyDiet && (
            <div className="mb-4">
              <h3 className="font-medium text-brand-charcoal mb-2 text-sm">Alimentazione Quotidiana</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(lifestyle.dailyDiet as Record<string, string>)
                  .filter(([, v]) => v)
                  .map(([key, v]) => (
                    <div key={key} className="py-1 px-2 rounded bg-gray-50">
                      <span className="font-medium text-brand-charcoal capitalize">{key}:</span>{' '}
                      <span className="text-brand-gray-medium">{v}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {lifestyle.noteAggiuntive && (
            <div>
              <h3 className="font-medium text-brand-charcoal mb-2 text-sm">Note Aggiuntive</h3>
              <p className="text-sm text-brand-gray-medium bg-gray-50 p-2 rounded">{lifestyle.noteAggiuntive}</p>
            </div>
          )}
        </section>

        {/* Admin Notes */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Note Private</h2>
          <form
            action={async (formData: FormData) => {
              'use server';
              const notes = formData.get('notes') as string;
              await updateNotesAction(id, notes);
            }}
          >
            <textarea
              name="notes"
              defaultValue={submission.notes || ''}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple resize-y"
              placeholder="Aggiungi note private su questa consulenza..."
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 text-sm bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark transition-colors"
            >
              Salva note
            </button>
          </form>
        </section>

        {/* Toggle Viewed */}
        <div className="flex justify-end">
          <form
            action={async () => {
              'use server';
              await toggleViewedAction(id);
            }}
          >
            <button
              type="submit"
              className="text-sm text-brand-gray-medium hover:text-brand-dark transition-colors underline"
            >
              {submission.adminViewed ? 'Segna come non letto' : 'Segna come letto'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
