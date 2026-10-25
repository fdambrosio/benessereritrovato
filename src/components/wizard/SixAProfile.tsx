'use client';

import dynamic from 'next/dynamic';
import type { calculateSixAScores } from '@/lib/scoring/engine';
import { sixASelfAssessmentItems } from '@/data/six-a';

const ProfileChart = dynamic(
  () => import('recharts').then(({ ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Text }) => {
    return function Chart({ areas }: { areas: ReturnType<typeof calculateSixAScores> }) {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={areas} outerRadius="45%">
            <PolarGrid />
            <PolarAngleAxis
              dataKey="label"
              tick={({ x, y, textAnchor, payload }) => (
                <Text x={x} y={y} textAnchor={textAnchor} width={80} fontSize={10} verticalAnchor="middle">
                  {payload.value.split(' (')[0]}
                </Text>
              )}
            />
            <PolarRadiusAxis domain={[0, 100]} tickCount={5} tick={{ fontSize: 10 }} />
            <Radar name="Benessere" dataKey="normalized" stroke="#7516e3" fill="#7516e3" fillOpacity={0.25} />
          </RadarChart>
        </ResponsiveContainer>
      );
    };
  }),
  { ssr: false },
);

interface SixAProfileProps {
  areas: ReturnType<typeof calculateSixAScores>;
  selfAssessmentAverage: number;
  selfAssessmentAnswers: Record<string, number>;
}

export default function SixAProfile({ areas, selfAssessmentAverage, selfAssessmentAnswers }: SixAProfileProps) {
  const lowest = Math.min(...areas.map((area) => area.raw));
  const priorities = areas.filter((area) => area.raw === lowest);

  return (
    <div className="space-y-6">
      <section className="bg-background rounded-xl border border-brand-gray-light/30 p-6">
        <h2 className="text-lg font-semibold text-brand-dark">Il tuo profilo nelle sei aree</h2>
        <p className="text-sm text-brand-gray-medium mt-2">
          Un punteggio più alto indica maggiore benessere percepito. Ogni area va da 2 a 8 punti.
          Il grafico rappresenta lo stesso intervallo su scala 0–100.
        </p>
        <div aria-hidden="true" className="-mx-4 sm:mx-0">
          <ProfileChart areas={areas} />
        </div>
        <dl className="space-y-3 text-sm">
          {areas.map((area) => (
            <div key={area.id} className="flex justify-between gap-4 border-b border-gray-100 pb-2">
              <dt className="text-brand-charcoal">{area.label}</dt>
              <dd className="font-semibold text-brand-purple whitespace-nowrap">{area.raw} / 8</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="bg-background rounded-xl border border-brand-gray-light/30 p-6">
        <h2 className="text-lg font-semibold text-brand-dark mb-3">Autovalutazione Globale</h2>
        <dl className="space-y-3 text-sm">
          {sixASelfAssessmentItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <dt>{item.text}</dt>
              <dd className="font-semibold whitespace-nowrap">{selfAssessmentAnswers[item.id]} / 10</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-brand-gray-medium mt-4">
          Media di benessere percepito: <strong>{selfAssessmentAverage} / 10</strong> (stress invertito).
          Questi valori sono separati dalle sei aree del metodo.
        </p>
      </section>
      <section className="bg-background rounded-xl border border-brand-gray-light/30 p-6">
        <h2 className="text-lg font-semibold text-brand-dark mb-2">Da dove ripartire</h2>
        <p className="text-sm text-brand-gray-medium">
          {priorities.length === areas.length
            ? 'Le sei aree hanno lo stesso punteggio: non emerge una priorità relativa. Questo non implica necessariamente un livello elevato di benessere.'
            : `Le aree con il punteggio più basso sono: ${priorities.map((area) => area.label).join(', ')}. Possono essere un punto di partenza per un approfondimento personalizzato.`}
        </p>
        <p className="text-xs text-brand-gray-medium mt-3">
          I risultati sono orientativi, non costituiscono una diagnosi e non utilizzano soglie cliniche.
        </p>
      </section>
    </div>
  );
}
