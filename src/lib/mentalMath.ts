import type { MentalMathCategory, MentalMathTemplate } from '../types'

const randomInt = (min: number, max: number, random = Math.random) => Math.floor(random() * (max - min + 1)) + min
const pick = <T,>(values: T[], random = Math.random) => values[randomInt(0, values.length - 1, random)]

export function nextTier(tier: number, streak: number, correct: boolean) {
  if (!correct) return { tier: Math.max(1, tier - 1), streak: 0 }
  const newStreak = streak + 1
  if (newStreak >= 3) return { tier: Math.min(5, tier + 1), streak: 0 }
  return { tier, streak: newStreak }
}

export function generateMentalProblem(tier: number, random = Math.random): MentalMathTemplate {
  const safeTier = Math.max(1, Math.min(5, Math.round(tier)))
  const categoriesByTier: Record<number, MentalMathCategory[]> = {
    1: ['addition', 'multiplication', 'fractions'],
    2: ['addition', 'multiplication', 'division', 'percentages'],
    3: ['multiplication', 'division', 'fractions', 'percentages'],
    4: ['fractions', 'percentages', 'expected-value', 'estimation'],
    5: ['multiplication', 'percentages', 'expected-value', 'estimation']
  }
  const category = pick(categoriesByTier[safeTier], random)
  switch (category) {
    case 'addition': return additionProblem(safeTier, random)
    case 'multiplication': return multiplicationProblem(safeTier, random)
    case 'division': return divisionProblem(safeTier, random)
    case 'fractions': return fractionProblem(safeTier, random)
    case 'percentages': return percentageProblem(safeTier, random)
    case 'expected-value': return evProblem(safeTier, random)
    case 'estimation': return estimationProblem(safeTier, random)
  }
}

function result(category: MentalMathCategory, tier: number, prompt: string, answer: number, method: string, tolerance = 1e-9): MentalMathTemplate {
  return { category, tier, prompt, answer, tolerance, displayAnswer: Number(answer.toFixed(4)).toString(), method }
}

function additionProblem(tier: number, random: () => number) {
  const max = tier === 1 ? 50 : tier === 2 ? 200 : 1000
  const a = randomInt(11, max, random), b = randomInt(11, max, random)
  const subtract = random() > 0.65
  if (subtract) {
    const high = Math.max(a, b), low = Math.min(a, b)
    return result('addition', tier, `${high} − ${low}`, high - low, 'Compensate: round one number, calculate, then undo the rounding.')
  }
  return result('addition', tier, `${a} + ${b}`, a + b, 'Group hundreds, tens and units; or round one addend and compensate.')
}

function multiplicationProblem(tier: number, random: () => number) {
  if (tier <= 2) {
    const a = randomInt(3, tier === 1 ? 12 : 25, random), b = randomInt(3, tier === 1 ? 12 : 20, random)
    return result('multiplication', tier, `${a} × ${b}`, a * b, 'Decompose one factor into tens and units, then distribute.')
  }
  const a = randomInt(12, tier === 5 ? 99 : 49, random), b = pick([11, 15, 18, 25, 50], random)
  return result('multiplication', tier, `${a} × ${b}`, a * b, b === 25 ? 'Multiply by 100, then divide by 4.' : b === 50 ? 'Multiply by 100, then halve.' : 'Decompose the easier factor and distribute.')
}

function divisionProblem(tier: number, random: () => number) {
  const divisor = randomInt(2, tier <= 2 ? 12 : 25, random)
  const quotient = randomInt(2, tier <= 2 ? 20 : 60, random)
  return result('division', tier, `${divisor * quotient} ÷ ${divisor}`, quotient, 'Factor or cancel before dividing; use multiplication to check.')
}

function fractionProblem(tier: number, random: () => number) {
  const denominators = tier <= 2 ? [2, 4, 5, 10] : [8, 16, 20, 25, 40]
  const denominator = pick(denominators, random)
  let numerator = randomInt(1, denominator - 1, random)
  const answer = numerator / denominator
  return result('fractions', tier, `Convert ${numerator}/${denominator} to a decimal`, answer, 'Reduce first, then use a known fraction or scale the denominator to 10, 100 or 1,000.')
}

function percentageProblem(tier: number, random: () => number) {
  const percentages = tier <= 2 ? [10, 20, 25, 50] : [5, 12.5, 15, 35, 75]
  const percent = pick(percentages, random)
  const baseUnit = percent === 12.5 ? 8 : percent % 5 === 0 ? 20 : 10
  const amount = randomInt(2, tier + 6, random) * baseUnit
  return result('percentages', tier, `${percent}% of ${amount}`, percent / 100 * amount, percent === 12.5 ? '12.5% is one eighth.' : 'Find 10%, 5%, 25% or 50%, then combine those chunks.')
}

function evProblem(tier: number, random: () => number) {
  const probabilities = [0.25, 0.4, 0.6, 0.75]
  const p = pick(probabilities, random), win = randomInt(2, 8 + tier * 3, random) * 2, loss = randomInt(1, 4 + tier, random)
  const answer = p * win - (1 - p) * loss
  return result('expected-value', tier, `${Math.round(p * 100)}%: win £${win}; otherwise lose £${loss}. EV?`, answer, 'Weight the positive and negative payoffs separately, then add them.')
}

function estimationProblem(tier: number, random: () => number) {
  const a = randomInt(40, 99, random), b = randomInt(40, 99, random)
  const answer = Math.round((a * b) / 100) * 100
  return result('estimation', tier, `Estimate ${a} × ${b} to the nearest hundred`, answer, 'Round one factor up and the other down, multiply, then check the direction of the error.', 50.0001)
}

export function checkMentalAnswer(problem: MentalMathTemplate, raw: string) {
  const value = Number(raw.trim().replace(/[,£%]/g, ''))
  return Number.isFinite(value) && Math.abs(value - problem.answer) <= problem.tolerance
}
