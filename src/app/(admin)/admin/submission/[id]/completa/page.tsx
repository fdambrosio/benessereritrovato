'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import RadioGroup from '@/components/ui/RadioGroup';
import SliderScale from '@/components/ui/SliderScale';
import { locusOfControlTest } from '@/data/tests/locus-of-control';
import { eventiSaluteTest } from '@/data/tests/eventi-salute';
import { medicineAlternativeTest } from '@/data/tests/medicine-alternative';
import { leadershipTest } from '@/data/tests/leadership';
import { selfAssessmentItems } from '@/data/self-assessment';
import { foodHabitItems, lifestyleIndicators } from '@/data/lifestyle';
import { getSubmissionForCompletion, completeConsultation } from '../../../actions';
import type { AnswerValue } from '@/types/test';
import type { LifestyleData } from '@/types/wizard';

const ABCD_OPTIONS = [
  { value: 'A', label: 'Molto d\'accordo' },
  { value: 'B', label: 'Abbastanza d\'accordo' },
  { value: 'C', label: 'Poco d\'accordo' },
  { value: 'D', label: 'Per niente d\'accordo' },
];

type TestConfig = typeof locusOfControlTest;

interface TestSectionData {
  config: TestConfig;
  answers: Record<number, AnswerValue>;
  setAnswers: (answers: Record<number, AnswerValue>) => void;
}

function CollapsibleSection({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <section className="bg-white rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-base font-semibold text-brand-dark">{title}</h3>
        <span className="text-brand-gray-medium text-lg">{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100 pt-4">{children}</div>}
    </section>
  );
}

function TestQuestions({ config, answers, setAnswers, existingKeys }: TestSectionData & { existingKeys: Set<number> }) {
  return (
    <div className="space-y-4">
      {config.questions.map((q, idx) => {
        const isPreFilled = existingKeys.has(q.id);
        return (
          <div key={q.id} className={isPreFilled ? 'bg-purple-50 rounded-lg p-3 -mx-1' : ''}>
            <p className="text-sm text-brand-charcoal mb-2 leading-relaxed">
              <span className="font-medium text-brand-dark">{idx + 1}.</span>{' '}
              {q.text}
              {isPreFilled && <span className="text-xs text-brand-purple ml-2">(compilata dall&apos;utente)</span>}
            </p>
            <RadioGroup
              name={`${config.testId}-${q.id}`}
              value={answers[q.id]}
              onChange={(v) => setAnswers({ ...answers, [q.id]: v as AnswerValue })}
              options={ABCD_OPTIONS}
            />
          </div>
        );
      })}
    </div>
  );
}

const emptyLifestyle: LifestyleData = {
  foodHabits: {},
  lifestyleIndicators: {},
  dailyDiet: {
    colazione: '',
    spuntino: '',
    pranzo: '',
    merenda: '',
    cena: '',
    dopocena: '',
    fuoripasto: '',
  },
  noteAggiuntive: '',
};

export default function CompletaConsultazioneePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');

  // Track which answer keys came from the lite submission
  const [existingLocusKeys, setExistingLocusKeys] = useState<Set<number>>(new Set());
  const [existingEventiKeys, setExistingEventiKeys] = useState<Set<number>>(new Set());
  const [existingMedicineKeys, setExistingMedicineKeys] = useState<Set<number>>(new Set());
  const [existingLeadershipKeys, setExistingLeadershipKeys] = useState<Set<number>>(new Set());
  const [existingSaKeys, setExistingSaKeys] = useState<Set<string>>(new Set());

  // Test answers
  const [locusAnswers, setLocusAnswers] = useState<Record<number, AnswerValue>>({});
  const [eventiAnswers, setEventiAnswers] = useState<Record<number, AnswerValue>>({});
  const [medicineAnswers, setMedicineAnswers] = useState<Record<number, AnswerValue>>({});
  const [leadershipAnswers, setLeadershipAnswers] = useState<Record<number, AnswerValue>>({});
  const [saAnswers, setSaAnswers] = useState<Record<string, number>>({});

  // Lifestyle
  const [lifestyle, setLifestyle] = useState<LifestyleData>(emptyLifestyle);

  // Additional personal data
  const [eta, setEta] = useState('');
  const [peso, setPeso] = useState('');
  const [altezza, setAltezza] = useState('');
  const [citta, setCitta] = useState('');

  useEffect(() => {
    async function load() {
      const sub = await getSubmissionForCompletion(id);
      if (!sub) {
        setError('Consulenza non trovata');
        setLoading(false);
        return;
      }
      setNome(`${sub.nome} ${sub.cognome}`);

      // Pre-fill existing answers (convert string keys to numbers)
      const locusExisting: Record<number, AnswerValue> = {};
      const locusKeys = new Set<number>();
      for (const [k, v] of Object.entries(sub.locusAnswers)) {
        locusExisting[Number(k)] = v;
        locusKeys.add(Number(k));
      }
      setLocusAnswers(locusExisting);
      setExistingLocusKeys(locusKeys);

      const eventiExisting: Record<number, AnswerValue> = {};
      const eventiKeys = new Set<number>();
      for (const [k, v] of Object.entries(sub.eventiSaluteAnswers)) {
        eventiExisting[Number(k)] = v;
        eventiKeys.add(Number(k));
      }
      setEventiAnswers(eventiExisting);
      setExistingEventiKeys(eventiKeys);

      const medicineExisting: Record<number, AnswerValue> = {};
      const medicineKeys = new Set<number>();
      for (const [k, v] of Object.entries(sub.medicineAlternativeAnswers)) {
        medicineExisting[Number(k)] = v;
        medicineKeys.add(Number(k));
      }
      setMedicineAnswers(medicineExisting);
      setExistingMedicineKeys(medicineKeys);

      const leadershipExisting: Record<number, AnswerValue> = {};
      const leadershipKeys = new Set<number>();
      for (const [k, v] of Object.entries(sub.leadershipAnswers)) {
        leadershipExisting[Number(k)] = v;
        leadershipKeys.add(Number(k));
      }
      setLeadershipAnswers(leadershipExisting);
      setExistingLeadershipKeys(leadershipKeys);

      setSaAnswers(sub.selfAssessmentAnswers || {});
      setExistingSaKeys(new Set(Object.keys(sub.selfAssessmentAnswers || {})));

      if (sub.lifestyleAnswers && Object.keys(sub.lifestyleAnswers).length > 0) {
        setLifestyle({ ...emptyLifestyle, ...sub.lifestyleAnswers });
      }

      if (sub.eta) setEta(String(sub.eta));
      if (sub.peso) setPeso(String(sub.peso));
      if (sub.altezza) setAltezza(String(sub.altezza));
      if (sub.citta) setCitta(sub.citta);

      setLoading(false);
    }
    load();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await completeConsultation(id, {
        locusAnswers,
        eventiSaluteAnswers: eventiAnswers,
        medicineAlternativeAnswers: medicineAnswers,
        leadershipAnswers: leadershipAnswers,
        selfAssessmentAnswers: saAnswers,
        lifestyleData: lifestyle,
        eta: eta ? parseInt(eta) : null,
        peso: peso ? parseFloat(peso) : null,
        altezza: altezza ? parseFloat(altezza) : null,
        citta: citta || null,
      });
      router.push(`/admin/submission/${id}`);
    } catch (e) {
      console.error('Error completing consultation:', e);
      setError('Errore nel salvataggio. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-gray-medium">Caricamento...</p>
      </div>
    );
  }

  if (error && !nome) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/admin/dashboard" className="text-brand-purple hover:underline">
            Torna alla dashboard
          </Link>
        </div>
      </div>
    );
  }

  const updateFoodHabit = (itemId: string, field: string, value: boolean | string) => {
    setLifestyle((prev) => ({
      ...prev,
      foodHabits: {
        ...prev.foodHabits,
        [itemId]: {
          ...(prev.foodHabits[itemId] || { checked: false, frequency: '' }),
          [field]: value,
        },
      },
    }));
  };

  const updateLifestyleIndicator = (itemId: string, field: string, value: boolean | string) => {
    setLifestyle((prev) => ({
      ...prev,
      lifestyleIndicators: {
        ...prev.lifestyleIndicators,
        [itemId]: {
          ...(prev.lifestyleIndicators[itemId] || { checked: false }),
          [field]: value,
        },
      },
    }));
  };

  const updateDailyDiet = (meal: string, value: string) => {
    setLifestyle((prev) => ({
      ...prev,
      dailyDiet: { ...prev.dailyDiet, [meal]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/submission/${id}`}
              className="text-sm text-brand-purple hover:underline"
            >
              &larr; Dettaglio
            </Link>
            <h1 className="text-lg font-bold text-brand-dark">
              Completa consulenza: {nome}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Salvataggio...' : 'Salva consulenza completa'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Additional Personal Data */}
        <CollapsibleSection title="Dati aggiuntivi" defaultOpen>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1">Età</label>
              <input
                type="number"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                placeholder="Anni"
                min="0"
                max="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1">Peso (kg)</label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                placeholder="kg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1">Altezza (cm)</label>
              <input
                type="number"
                value={altezza}
                onChange={(e) => setAltezza(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                placeholder="cm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1">Città</label>
              <input
                type="text"
                value={citta}
                onChange={(e) => setCitta(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                placeholder="Città"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Locus of Control */}
        <CollapsibleSection title={`${locusOfControlTest.title} (${Object.keys(locusAnswers).length}/${locusOfControlTest.questions.length})`}>
          <TestQuestions
            config={locusOfControlTest}
            answers={locusAnswers}
            setAnswers={setLocusAnswers}
            existingKeys={existingLocusKeys}
          />
        </CollapsibleSection>

        {/* Eventi e Salute */}
        <CollapsibleSection title={`${eventiSaluteTest.title} (${Object.keys(eventiAnswers).length}/${eventiSaluteTest.questions.length})`}>
          <TestQuestions
            config={eventiSaluteTest}
            answers={eventiAnswers}
            setAnswers={setEventiAnswers}
            existingKeys={existingEventiKeys}
          />
        </CollapsibleSection>

        {/* Medicine Alternative */}
        <CollapsibleSection title={`${medicineAlternativeTest.title} (${Object.keys(medicineAnswers).length}/${medicineAlternativeTest.questions.length})`}>
          <TestQuestions
            config={medicineAlternativeTest}
            answers={medicineAnswers}
            setAnswers={setMedicineAnswers}
            existingKeys={existingMedicineKeys}
          />
        </CollapsibleSection>

        {/* Leadership */}
        <CollapsibleSection title={`${leadershipTest.title} (${Object.keys(leadershipAnswers).length}/${leadershipTest.questions.length})`}>
          <TestQuestions
            config={leadershipTest}
            answers={leadershipAnswers}
            setAnswers={setLeadershipAnswers}
            existingKeys={existingLeadershipKeys}
          />
        </CollapsibleSection>

        {/* Self Assessment */}
        <CollapsibleSection title={`Autovalutazione (${Object.keys(saAnswers).length}/${selfAssessmentItems.length})`}>
          <div className="space-y-4">
            {selfAssessmentItems.map((item) => {
              const isPreFilled = existingSaKeys.has(item.id);
              return (
                <div key={item.id} className={isPreFilled ? 'bg-purple-50 rounded-lg p-3 -mx-1' : ''}>
                  <p className="text-sm text-brand-charcoal mb-2 leading-relaxed">
                    {item.text}
                    {isPreFilled && <span className="text-xs text-brand-purple ml-2">(compilata dall&apos;utente)</span>}
                  </p>
                  <SliderScale
                    value={saAnswers[item.id]}
                    onChange={(v) => setSaAnswers((prev) => ({ ...prev, [item.id]: v }))}
                  />
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Lifestyle - Food Habits */}
        <CollapsibleSection title="Stile di Vita - Abitudini Alimentari">
          <div className="space-y-3">
            {foodHabitItems.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <label className="flex items-center gap-2 min-w-[200px]">
                  <input
                    type="checkbox"
                    checked={lifestyle.foodHabits[item.id]?.checked || false}
                    onChange={(e) => updateFoodHabit(item.id, 'checked', e.target.checked)}
                    className="w-4 h-4 rounded border-brand-gray-light text-brand-purple focus:ring-brand-purple"
                  />
                  <span className="text-sm text-brand-charcoal">{item.label}</span>
                </label>
                {item.hasFrequency && lifestyle.foodHabits[item.id]?.checked && (
                  <input
                    type="text"
                    value={lifestyle.foodHabits[item.id]?.frequency || ''}
                    onChange={(e) => updateFoodHabit(item.id, 'frequency', e.target.value)}
                    placeholder="Frequenza"
                    className="px-2 py-1 text-sm border border-brand-gray-light rounded w-32 focus:outline-none focus:ring-1 focus:ring-brand-purple/50"
                  />
                )}
                {item.hasVariant && item.variants && lifestyle.foodHabits[item.id]?.checked && (
                  <select
                    value={lifestyle.foodHabits[item.id]?.variant || ''}
                    onChange={(e) => updateFoodHabit(item.id, 'variant', e.target.value)}
                    className="px-2 py-1 text-sm border border-brand-gray-light rounded focus:outline-none focus:ring-1 focus:ring-brand-purple/50"
                  >
                    <option value="">Seleziona...</option>
                    {item.variants.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Lifestyle - Indicators */}
        <CollapsibleSection title="Stile di Vita - Indicatori">
          <div className="space-y-3">
            {lifestyleIndicators.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <label className="flex items-center gap-2 min-w-[250px]">
                  <input
                    type="checkbox"
                    checked={lifestyle.lifestyleIndicators[item.id]?.checked || false}
                    onChange={(e) => updateLifestyleIndicator(item.id, 'checked', e.target.checked)}
                    className="w-4 h-4 rounded border-brand-gray-light text-brand-purple focus:ring-brand-purple"
                  />
                  <span className="text-sm text-brand-charcoal">{item.label}</span>
                </label>
                {item.hasNumericInput && lifestyle.lifestyleIndicators[item.id]?.checked && (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={lifestyle.lifestyleIndicators[item.id]?.numericValue || ''}
                      onChange={(e) => updateLifestyleIndicator(item.id, 'numericValue', e.target.value)}
                      className="px-2 py-1 text-sm border border-brand-gray-light rounded w-20 focus:outline-none focus:ring-1 focus:ring-brand-purple/50"
                    />
                    <span className="text-xs text-brand-gray-medium">{item.numericLabel}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Lifestyle - Daily Diet */}
        <CollapsibleSection title="Stile di Vita - Alimentazione Quotidiana">
          <div className="space-y-3">
            {['colazione', 'spuntino', 'pranzo', 'merenda', 'cena', 'dopocena', 'fuoripasto'].map((meal) => (
              <div key={meal}>
                <label className="block text-sm font-medium text-brand-charcoal mb-1 capitalize">{meal}</label>
                <textarea
                  value={(lifestyle.dailyDiet as Record<string, string>)[meal] || ''}
                  onChange={(e) => updateDailyDiet(meal, e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 resize-y"
                />
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Note */}
        <CollapsibleSection title="Note Aggiuntive">
          <textarea
            value={lifestyle.noteAggiuntive}
            onChange={(e) => setLifestyle((prev) => ({ ...prev, noteAggiuntive: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 resize-y"
            placeholder="Note aggiuntive sulla consulenza..."
          />
        </CollapsibleSection>

        {/* Submit */}
        <div className="flex justify-end pt-4 pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 text-base font-medium rounded-lg bg-brand-purple text-white hover:bg-brand-purple-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Salvataggio...' : 'Salva consulenza completa'}
          </button>
        </div>
      </main>
    </div>
  );
}
