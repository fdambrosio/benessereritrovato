import type { AnswerValue, ScoringDirection, QuestionConfig, ScoreInterpretation, SelfAssessmentItem } from '@/types/test';

export function scoreAnswer(answer: AnswerValue, direction: ScoringDirection): number {
  const descending: Record<AnswerValue, number> = { A: 4, B: 3, C: 2, D: 1 };
  const inverse: Record<AnswerValue, number> = { A: 1, B: 2, C: 3, D: 4 };
  return direction === 'descending' ? descending[answer] : inverse[answer];
}

export function calculateRawScore(
  answers: Record<number, AnswerValue>,
  questions: QuestionConfig[]
): number {
  return questions.reduce((sum, q) => {
    const answer = answers[q.id];
    if (!answer) return sum;
    return sum + scoreAnswer(answer, q.scoring);
  }, 0);
}

export function normalizeScore(
  rawScore: number,
  subsetSize: number,
  fullScoreRange: { min: number; max: number }
): number {
  const subsetMin = subsetSize;
  const subsetMax = subsetSize * 4;
  const { min: fullMin, max: fullMax } = fullScoreRange;
  const normalized = ((rawScore - subsetMin) / (subsetMax - subsetMin)) * (fullMax - fullMin) + fullMin;
  return Math.round(normalized * 10) / 10;
}

export function getInterpretation(
  normalizedScore: number,
  interpretations: ScoreInterpretation[]
): ScoreInterpretation {
  const found = interpretations.find(
    (i) => normalizedScore >= i.minScore && normalizedScore <= i.maxScore
  );
  return found ?? interpretations[interpretations.length - 1];
}

export function calculateSelfAssessmentAverage(
  answers: Record<string, number>,
  items: SelfAssessmentItem[]
): number {
  let total = 0;
  let count = 0;
  for (const item of items) {
    const value = answers[item.id];
    if (value !== undefined) {
      total += item.isNegative ? (11 - value) : value;
      count++;
    }
  }
  return count > 0 ? Math.round((total / count) * 10) / 10 : 0;
}
