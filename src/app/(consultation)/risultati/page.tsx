'use client';

import { useState, useEffect } from 'react';
import { useWizard } from '@/context/WizardContext';
import { WIZARD_STEPS } from '@/types/wizard';
import { locusOfControlTest } from '@/data/tests/locus-of-control';
import { eventiSaluteTest } from '@/data/tests/eventi-salute';
import { medicineAlternativeTest } from '@/data/tests/medicine-alternative';
import { leadershipTest } from '@/data/tests/leadership';
import dynamic from 'next/dynamic';
import type { ScoreInterpretation } from '@/types/test';
import SixAProfile from '@/components/wizard/SixAProfile';
import type { submitSixAConsultation } from '../actions';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const RadarChart = dynamic(
  () => import('recharts').then((mod) => mod.RadarChart),
  { ssr: false }
);
const PolarGrid = dynamic(
  () => import('recharts').then((mod) => mod.PolarGrid),
  { ssr: false }
);
const PolarAngleAxis = dynamic(
  () => import('recharts').then((mod) => mod.PolarAngleAxis),
  { ssr: false }
);
const PolarRadiusAxis = dynamic(
  () => import('recharts').then((mod) => mod.PolarRadiusAxis),
  { ssr: false }
);
const Radar = dynamic(
  () => import('recharts').then((mod) => mod.Radar),
  { ssr: false }
);

interface TestScore {
  raw: number;
  normalized: number;
  interpretation: ScoreInterpretation;
}

interface SubmissionResult {
  version?: never;
  submissionId: string;
  scores: {
    locus: TestScore;
    eventiSalute: TestScore;
    medicineAlternative: TestScore;
    leadership: TestScore;
    selfAssessmentAverage: number;
    selfAssessmentAnswers: Record<string, number>;
  };
  emailSent: boolean;
}

function normalizeToPercent(score: number, range: { min: number; max: number }): number {
  return Math.round(((score - range.min) / (range.max - range.min)) * 100);
}

function getBorderColor(interpretation: ScoreInterpretation, interpretations: ScoreInterpretation[]): string {
  const index = interpretations.findIndex((i) => i.key === interpretation.key);
  const total = interpretations.length;
  if (total <= 1) return 'border-l-green-500';
  if (index === total - 1) return 'border-l-green-500';
  if (index === 0) return 'border-l-red-500';
  return 'border-l-yellow-500';
}

export default function RisultatiPage() {
  const { state, setCurrentStep } = useWizard();
  const [result, setResult] = useState<SubmissionResult | Awaited<ReturnType<typeof submitSixAConsultation>> | null>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('submission-result');
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    // Delay chart render to allow dynamic imports to load
    const timer = setTimeout(() => setChartReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-[645px] mx-auto">
          <div className="bg-background rounded-xl shadow-sm border border-brand-gray-light/30 p-8 text-center">
            <h2 className="text-xl font-semibold text-brand-dark mb-4 font-[family-name:var(--font-platypi)]">
              Risultati non disponibili
            </h2>
            <p className="text-sm text-brand-gray-medium mb-6">
              Non è stato possibile recuperare i risultati della consulenza. Completa tutti i passaggi del questionario per visualizzare il tuo profilo di benessere.
            </p>
            <a
              href={WIZARD_STEPS[0].path}
              className="inline-flex items-center justify-center px-5 py-2.5 text-base font-medium rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark transition-colors"
            >
              Torna all&apos;inizio
            </a>
          </div>
        </div>
      </div>
    );
  }

  const nome = state.personalData?.nome ?? '';

  if (result.version === '6a') {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-12">
        <div className="max-w-[645px] mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-brand-dark text-center">
            Il tuo profilo delle 6A{nome ? `, ${nome}` : ''}
          </h1>
          <SixAProfile {...result.scores} />
          <div className="bg-brand-lavender rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-brand-dark mb-3">Vuoi approfondire questi risultati?</h2>
            <a
              href="https://www.ilbenessereritrovato.it/prenota-un-colloquio-conoscitivo-gratuito/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-6 py-3 rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark"
            >
              Prenota la tua chiamata gratuita
            </a>
          </div>
          <p className="text-xs text-brand-gray-medium text-center">
            Questa consulenza non ha finalità terapeutiche di tipo medico o psicologico.
            Le indicazioni vanno sottoposte alla valutazione del medico curante.
          </p>
        </div>
      </div>
    );
  }

  const { scores } = result;
  const locusPercent = normalizeToPercent(scores.locus.normalized, locusOfControlTest.fullScoreRange);
  const eventiPercent = normalizeToPercent(scores.eventiSalute.normalized, eventiSaluteTest.fullScoreRange);
  const medicinePercent = normalizeToPercent(scores.medicineAlternative.normalized, medicineAlternativeTest.fullScoreRange);
  const leadershipPercent = normalizeToPercent(scores.leadership.normalized, leadershipTest.fullScoreRange);
  const answers = scores.selfAssessmentAnswers;
  // Stress is inverted so that a higher value always means a more favourable state
  const stressPercent = (11 - (answers.stress ?? 5)) * 10;
  const felicitaPercent = (answers.felicita ?? 5) * 10;

  const radarData = [
    { axis: 'Autoefficacia', value: locusPercent },
    { axis: 'Salute', value: eventiPercent },
    { axis: 'Conoscenza', value: medicinePercent },
    { axis: 'Autonomia', value: leadershipPercent },
    { axis: 'Gestione dello stress', value: stressPercent },
    { axis: 'Felicità', value: felicitaPercent },
  ];

  const lowestValue = Math.min(...radarData.map((d) => d.value));
  const allEqual = radarData.every((d) => d.value === lowestValue);
  const priorityAxes = radarData.filter((d) => d.value === lowestValue).map((d) => d.axis);

  const testCards = [
    {
      title: locusOfControlTest.title,
      score: scores.locus.normalized,
      interpretation: scores.locus.interpretation,
      interpretations: locusOfControlTest.interpretations,
      range: locusOfControlTest.fullScoreRange,
    },
    {
      title: eventiSaluteTest.title,
      score: scores.eventiSalute.normalized,
      interpretation: scores.eventiSalute.interpretation,
      interpretations: eventiSaluteTest.interpretations,
      range: eventiSaluteTest.fullScoreRange,
    },
    {
      title: medicineAlternativeTest.title,
      score: scores.medicineAlternative.normalized,
      interpretation: scores.medicineAlternative.interpretation,
      interpretations: medicineAlternativeTest.interpretations,
      range: medicineAlternativeTest.fullScoreRange,
    },
    {
      title: leadershipTest.title,
      score: scores.leadership.normalized,
      interpretation: scores.leadership.interpretation,
      interpretations: leadershipTest.interpretations,
      range: leadershipTest.fullScoreRange,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-12">
      <div className="max-w-[645px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-background rounded-xl shadow-sm border border-brand-gray-light/30 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark font-[family-name:var(--font-platypi)] text-center">
            Ecco il tuo profilo di benessere{nome ? `, ${nome}` : ''}!
          </h1>
        </div>

        {/* Radar Chart */}
        <div className="bg-background rounded-xl shadow-sm border border-brand-gray-light/30 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-dark mb-4 font-[family-name:var(--font-platypi)]">
            Il tuo profilo a colpo d&apos;occhio
          </h2>
          {chartReady && (
            <div className="w-full" style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <Radar
                    name="Profilo"
                    dataKey="value"
                    stroke="#7516e3"
                    fill="#7516e3"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Test Result Cards */}
        <div className="space-y-4">
          {testCards.map((card) => (
            <div
              key={card.title}
              className={`bg-background rounded-xl shadow-sm border border-brand-gray-light/30 p-6 border-l-4 ${getBorderColor(card.interpretation, card.interpretations)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-brand-dark">{card.title}</h3>
                <span className="text-sm font-medium text-brand-purple whitespace-nowrap ml-4">
                  {card.score} / {card.range.max}
                </span>
              </div>
              <p className="text-sm font-bold text-brand-charcoal mb-1">
                {card.interpretation.label}
              </p>
              <p className="text-sm text-brand-gray-medium leading-relaxed">
                {card.interpretation.description}
              </p>
            </div>
          ))}
        </div>

        {/* Self Assessment Average */}
        <div className="bg-background rounded-xl shadow-sm border border-brand-gray-light/30 p-6">
          <h3 className="text-base font-semibold text-brand-dark mb-2">Autovalutazione del Benessere</h3>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-brand-purple">
              {scores.selfAssessmentAverage}
            </div>
            <div className="text-sm text-brand-gray-medium">
              <p>su una scala da 1 a 10</p>
              <p className="text-xs mt-1">Media ponderata delle tue risposte di autovalutazione</p>
            </div>
          </div>
        </div>

        {/* Priority Area */}
        <div className="bg-background rounded-xl shadow-sm border border-brand-gray-light/30 p-6">
          <h3 className="text-base font-semibold text-brand-dark mb-2">Area prioritaria</h3>
          {allEqual ? (
            <p className="text-sm text-brand-gray-medium leading-relaxed">
              Tutti e sei gli ambiti risultano in equilibrio: non emerge un’area critica da cui ripartire con priorità.
            </p>
          ) : (
            <p className="text-sm text-brand-gray-medium leading-relaxed">
              Il punto più basso del tuo profilo è{' '}
              <span className="font-semibold text-brand-charcoal">{priorityAxes.join(' e ')}</span>{' '}
              ({lowestValue}/100). Ripartire da quest’area può aiutarti a recuperare energia e chiarezza.
            </p>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-brand-lavender rounded-xl p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-brand-dark mb-3 font-[family-name:var(--font-platypi)]">
            Vuoi approfondire questi risultati?
          </h2>
          <p className="text-sm text-brand-gray-medium mb-5">
            La Dott.ssa Loprieno ti contatterà personalmente per fissare data e ora della tua chiamata gratuita.
          </p>
          <a
            href="https://www.ilbenessereritrovato.it/prenota-un-colloquio-conoscitivo-gratuito/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark transition-colors"
          >
            Prenota la tua chiamata gratuita
          </a>
        </div>

        {/* Disclaimer Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-brand-gray-medium leading-relaxed max-w-md mx-auto">
            Questa consulenza non ha finalità terapeutiche di tipo medico o psicologico. I risultati
            hanno valore puramente orientativo e le indicazioni vanno sottoposte alla valutazione
            del medico curante.
          </p>
        </div>
      </div>
    </div>
  );
}
