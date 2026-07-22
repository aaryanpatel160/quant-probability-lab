export type Difficulty = 1 | 2 | 3 | 4 | 5
export type ModuleCategory = 'probability' | 'statistics' | 'markets'
export type QuestionPhase = 'guided' | 'independent' | 'checkpoint'

export interface ResourceCitation {
  label: string
  url: string
  note: string
}

export interface Lesson {
  id: string
  title: string
  summary: string
  keyIdeas: string[]
  workedExample: { prompt: string; steps: string[]; answer: string }
}

export interface Module {
  id: string
  order: number
  title: string
  shortTitle: string
  description: string
  category: ModuleCategory
  questionCount: number
  lesson: Lesson
  source: ResourceCitation
}

export type AnswerSpec =
  | { kind: 'multiple-choice'; options: string[]; correctIndex: number }
  | { kind: 'rational'; numerator: number; denominator: number }
  | { kind: 'numeric'; value: number; tolerance: number; suffix?: string }
  | { kind: 'self-graded'; rubric: string[] }

export interface Hint {
  level: number
  text: string
}

export interface Solution {
  approach: string
  steps: string[]
  answer: string
  commonTrap: string
  followUp?: string
}

export interface Question {
  id: string
  moduleId: string
  title: string
  prompt: string
  objective: string
  tags: string[]
  difficulty: Difficulty
  phase: QuestionPhase
  answer: AnswerSpec
  hints: Hint[]
  solution: Solution
  source: ResourceCitation
}

export interface Attempt {
  id?: number
  questionId: string
  response: string
  correct: boolean | null
  hintCount: number
  revealedSolution: boolean
  createdAt: string
}

export interface ProgressState {
  attempts: Attempt[]
  bookmarks: string[]
  notes: Record<string, string>
}

export interface MentalMathTemplate {
  category: MentalMathCategory
  tier: number
  prompt: string
  answer: number
  tolerance: number
  displayAnswer: string
  method: string
}

export type MentalMathCategory =
  | 'addition'
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'percentages'
  | 'estimation'
  | 'expected-value'

export interface MentalMathResult {
  id?: number
  category: MentalMathCategory
  tier: number
  correct: boolean
  responseMs: number
  createdAt: string
}
