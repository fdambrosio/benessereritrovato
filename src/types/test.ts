export type AnswerValue = 'A' | 'B' | 'C' | 'D';
export type ScoringDirection = 'descending' | 'inverse';

export interface QuestionConfig {
  id: number;
  text: string;
  scoring: ScoringDirection;
}

export interface ScoreInterpretation {
  minScore: number;
  maxScore: number;
  key: string;
  label: string;
  description: string;
}

export interface TestConfig {
  testId: string;
  title: string;
  subtitle: string;
  instruction: string;
  questions: QuestionConfig[];
  fullTestQuestionCount: number;
  fullScoreRange: { min: number; max: number };
  interpretations: ScoreInterpretation[];
}

export interface SelfAssessmentItem {
  id: string;
  text: string;
  isNegative: boolean;
}

export interface FoodHabitItem {
  id: string;
  label: string;
  hasFrequency: boolean;
  hasVariant?: boolean;
  variants?: string[];
}

export interface LifestyleIndicator {
  id: string;
  label: string;
  hasNumericInput?: boolean;
  numericLabel?: string;
}
