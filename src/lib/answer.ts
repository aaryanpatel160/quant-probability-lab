import type { AnswerSpec } from '../types'

export interface AnswerResult {
  correct: boolean | null
  parsed?: number
  message: string
}

export function parseNumericResponse(raw: string): number | null {
  let text = raw.trim().replace(/[£$€,\s]/g, '')
  if (!text) return null
  const isPercent = text.endsWith('%')
  if (isPercent) text = text.slice(0, -1)
  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(text)) {
    const [a, b] = text.split('/').map(Number)
    if (b === 0) return null
    const value = a / b
    return isPercent ? value / 100 : value
  }
  const value = Number(text)
  if (!Number.isFinite(value)) return null
  return isPercent ? value / 100 : value
}

export function checkAnswer(spec: AnswerSpec, raw: string): AnswerResult {
  if (spec.kind === 'self-graded') {
    return { correct: null, message: 'Reveal the model solution, then grade your reasoning against the rubric.' }
  }
  if (spec.kind === 'multiple-choice') {
    const selected = Number(raw)
    const correct = Number.isInteger(selected) && selected === spec.correctIndex
    return { correct, message: correct ? 'Correct.' : 'Not quite. Recheck the choices or take a hint.' }
  }
  const parsed = parseNumericResponse(raw)
  if (parsed === null) return { correct: false, message: 'Enter a number, decimal, percentage, or fraction such as 3/8.' }
  const expected = spec.kind === 'rational' ? spec.numerator / spec.denominator : spec.value
  let candidate = parsed
  if (spec.kind === 'numeric' && spec.suffix === '%' && raw.trim().endsWith('%')) candidate *= 100
  const tolerance = spec.kind === 'numeric' ? spec.tolerance : 1e-9
  const correct = Math.abs(candidate - expected) <= Math.max(tolerance, Math.abs(expected) * 1e-9)
  return { correct, parsed: candidate, message: correct ? 'Correct.' : 'Not quite. Check the setup and units.' }
}

export function expectedAnswerText(spec: AnswerSpec): string {
  switch (spec.kind) {
    case 'multiple-choice': return spec.options[spec.correctIndex]
    case 'rational': return `${spec.numerator}/${spec.denominator}`
    case 'numeric': return `${spec.value}${spec.suffix ?? ''}`
    case 'self-graded': return 'Self-graded explanation'
  }
}
