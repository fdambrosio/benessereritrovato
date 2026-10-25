import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Compile in memory using the existing TypeScript dependency, without adding a test runner.
function loadTypeScript(relativePath, imports = {}) {
  const filename = path.resolve(import.meta.dirname, '..', relativePath);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
    fileName: filename,
  }).outputText;
  const compiledModule = { exports: {} };
  const requireFromFile = createRequire(filename);
  runInNewContext(code, {
    module: compiledModule,
    exports: compiledModule.exports,
    require: (specifier) => imports[specifier] ?? requireFromFile(specifier),
  }, { filename });
  return compiledModule.exports;
}

const data = loadTypeScript('src/data/six-a.ts');
const engine = loadTypeScript('src/lib/scoring/engine.ts', { '@/data/six-a': data });
const questions = data.sixAAreas.flatMap((area) => area.questions);
const answersFor = (problem, resource) => Object.fromEntries(
  questions.map((question) => [question.id, question.id % 2 ? problem : resource]),
);

test('the PDF has six areas, 12 sequential ABCD questions and two global items', () => {
  assert.equal(data.sixAAreas.length, 6);
  assert.equal(questions.length, 12);
  assert.equal(questions.map((question) => question.id).join(','), '1,2,3,4,5,6,7,8,9,10,11,12');
  for (const area of data.sixAAreas) assert.equal(area.questions.length, 2);
  for (const question of questions) {
    assert.equal(question.scoring, question.id % 2 ? 'inverse' : 'descending');
  }
  assert.equal(data.sixASelfAssessmentItems.map((item) => item.id).join(','), 'stress,felicita');
  assert.equal(data.sixAOptions.map((option) => option.label).join('|'),
    'Quasi sempre / Molto spesso|Spesso|Raramente|Quasi mai / Mai');
});

test('all 16 answer pairs follow the PDF scoring for every area', () => {
  const values = ['A', 'B', 'C', 'D'];
  for (const [problemIndex, problem] of values.entries()) {
    for (const [resourceIndex, resource] of values.entries()) {
      const scores = engine.calculateSixAScores(answersFor(problem, resource));
      const expected = problemIndex + 1 + (4 - resourceIndex);
      assert.equal(scores.length, 6);
      for (const score of scores) {
        assert.equal(score.raw, expected);
        assert.equal(score.normalized, Math.round(((expected - 2) / 6) * 1000) / 10);
      }
    }
  }
});

test('each area is scored independently and includes both extreme scores', () => {
  const answers = answersFor('A', 'D');
  answers[1] = 'D';
  answers[2] = 'A';
  const scores = engine.calculateSixAScores(answers);
  assert.equal(scores[0].raw, 8);
  assert.equal(scores[0].normalized, 100);
  for (const score of scores.slice(1)) {
    assert.equal(score.raw, 2);
    assert.equal(score.normalized, 0);
  }
});

test('missing, unknown and invalid answers are rejected before scoring', () => {
  const complete = answersFor('B', 'C');
  assert.equal(data.sixAAnswersSchema.safeParse(complete).success, true);
  const missing = { ...complete };
  delete missing[12];
  for (const invalid of [missing, { ...complete, 13: 'A' }, { ...complete, 1: 'E' }, {}]) {
    assert.equal(data.sixAAnswersSchema.safeParse(invalid).success, false);
    assert.throws(() => engine.calculateSixAScores(invalid));
  }
});

test('global sliders require integers 1–10; only stress is reversed in the mean', () => {
  for (const invalid of [
    { stress: 0, felicita: 5 }, { stress: 5, felicita: 11 },
    { stress: 1.5, felicita: 5 }, { stress: 5 }, { stress: 5, felicita: 5, extra: 1 },
  ]) {
    assert.equal(data.sixASelfAssessmentSchema.safeParse(invalid).success, false);
  }
  for (const [stress, felicita, expected] of [[1, 10, 10], [10, 1, 1], [4, 8, 7.5]]) {
    const answers = data.sixASelfAssessmentSchema.parse({ stress, felicita });
    assert.equal(engine.calculateSelfAssessmentAverage(answers, data.sixASelfAssessmentItems), expected);
  }
});

test('legacy scoring is unchanged', () => {
  assert.equal(engine.scoreAnswer('A', 'descending'), 4);
  assert.equal(engine.scoreAnswer('A', 'inverse'), 1);
  assert.equal(engine.calculateRawScore({ 1: 'A', 25: 'D' }, [
    { id: 1, scoring: 'descending' }, { id: 25, scoring: 'inverse' },
  ]), 8);
  assert.equal(engine.normalizeScore(8, 2, { min: 25, max: 100 }), 100);
});

function loadActions(prisma, sendSixAAdminNotification) {
  return loadTypeScript('src/app/(consultation)/actions.ts', {
    '@/lib/db': { prisma },
    '@/lib/email/send': { sendSixAAdminNotification },
    '@/lib/scoring/engine': engine,
    '@/data/six-a': data,
    '@/data/tests/locus-of-control': loadTypeScript('src/data/tests/locus-of-control.ts'),
    '@/data/tests/eventi-salute': loadTypeScript('src/data/tests/eventi-salute.ts'),
    '@/data/tests/medicine-alternative': loadTypeScript('src/data/tests/medicine-alternative.ts'),
    '@/data/tests/leadership': loadTypeScript('src/data/tests/leadership.ts'),
    '@/data/self-assessment': loadTypeScript('src/data/self-assessment.ts'),
    '@/data/lite-questions': loadTypeScript('src/data/lite-questions.ts'),
  });
}

test('server action persists the new answers without inventing legacy scores', async () => {
  const writes = [];
  const notifications = [];
  const actions = loadActions({
    submission: {
      create: async ({ data }) => { writes.push(data); return { id: 'test-only-id', ...data }; },
      update: async (query) => { writes.push(query); },
    },
  }, async (id) => { notifications.push(id); });
  const answers = answersFor('D', 'A');
  const result = await actions.submitSixAConsultation({
    personalData: { nome: '  Test  ' },
    sixAAnswers: answers,
    selfAssessmentAnswers: { stress: 1, felicita: 10 },
  });
  assert.equal(writes.length, 2);
  assert.equal(writes[0].nome, 'Test');
  assert.deepEqual(JSON.parse(writes[0].sixAAnswers), answers);
  assert.deepEqual(JSON.parse(writes[0].selfAssessmentAnswers), { stress: 1, felicita: 10 });
  for (const field of ['locusScore', 'locusNormalized', 'eventiSaluteScore', 'medicineAlternativeScore', 'leadershipScore']) {
    assert.equal(writes[0][field], undefined);
  }
  assert.equal(result.version, '6a');
  assert.equal(result.submissionId, 'test-only-id');
  assert.equal(result.scores.areas.length, 6);
  assert.equal(result.scores.selfAssessmentAverage, 10);
  assert.equal(result.emailSent, true);
  assert.deepEqual(notifications, ['test-only-id']);
  assert.equal(writes[1].data.emailSent, true);
});

test('server action rejects incomplete requests without persistence or email', async () => {
  const unexpected = async () => { assert.fail('Invalid data must not reach persistence or email'); };
  const actions = loadActions({ submission: { create: unexpected, update: unexpected } }, unexpected);
  const valid = {
    personalData: { nome: 'Test' },
    sixAAnswers: answersFor('B', 'C'),
    selfAssessmentAnswers: { stress: 5, felicita: 5 },
  };
  for (const invalid of [
    { ...valid, sixAAnswers: {} },
    { ...valid, personalData: { nome: ' ' } },
    { ...valid, selfAssessmentAnswers: { stress: 0, felicita: 5 } },
    { ...valid, unknown: true },
  ]) {
    await assert.rejects(() => actions.submitSixAConsultation(invalid), /Dati non validi/);
  }
});
