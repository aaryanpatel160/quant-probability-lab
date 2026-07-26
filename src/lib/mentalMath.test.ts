import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { checkMentalAnswer, generateMentalProblem, nextTier } from './mentalMath'

describe('adaptive mental maths', () => {
  it('rises after three correct answers and falls after a miss', () => {
    expect(nextTier(2, 2, true)).toEqual({ tier: 3, streak: 0 })
    expect(nextTier(3, 1, false)).toEqual({ tier: 2, streak: 0 })
    expect(nextTier(1, 0, false).tier).toBe(1)
    expect(nextTier(5, 2, true).tier).toBe(5)
  })

  it('always generates finite, answerable problems at every tier', () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 5 }), fc.array(fc.double({ min: 0, max: 0.999999, noNaN: true }), { minLength: 8, maxLength: 8 }), (tier, values) => {
      let index = 0
      const random = () => values[index++ % values.length]
      const problem = generateMentalProblem(tier, random)
      expect(Number.isFinite(problem.answer)).toBe(true)
      expect(problem.answer).toBeGreaterThanOrEqual(0)
      expect(problem.displayAnswer).not.toContain('/')
      expect(problem.prompt.length).toBeGreaterThan(2)
      expect(problem.method.length).toBeGreaterThan(10)
      expect(checkMentalAnswer(problem, String(problem.answer))).toBe(true)
    }), { numRuns: 150 })
  })
})
