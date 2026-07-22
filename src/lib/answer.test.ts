import { describe, expect, it } from 'vitest'
import { checkAnswer, parseNumericResponse } from './answer'

describe('answer parsing', () => {
  it.each([
    ['3/8', 0.375], ['0.375', 0.375], ['37.5%', 0.375], ['£1,250', 1250], ['-2.5', -2.5]
  ])('parses %s', (raw, expected) => expect(parseNumericResponse(raw)).toBeCloseTo(expected))

  it('rejects invalid and zero-denominator fractions', () => {
    expect(parseNumericResponse('hello')).toBeNull()
    expect(parseNumericResponse('1/0')).toBeNull()
  })

  it('accepts equivalent rational forms', () => {
    expect(checkAnswer({ kind: 'rational', numerator: 3, denominator: 8 }, '6/16').correct).toBe(true)
    expect(checkAnswer({ kind: 'rational', numerator: 3, denominator: 8 }, '37.5%').correct).toBe(true)
  })

  it('applies numeric tolerance and percentage units', () => {
    expect(checkAnswer({ kind: 'numeric', value: 33.33, tolerance: 0.02, suffix: '%' }, '33.34%').correct).toBe(true)
    expect(checkAnswer({ kind: 'numeric', value: 2.5, tolerance: 0.01 }, '2.52').correct).toBe(false)
  })

  it('leaves open responses for self-grading', () => {
    expect(checkAnswer({ kind: 'self-graded', rubric: ['one', 'two'] }, 'reasoning').correct).toBeNull()
  })
})
