import { describe, expect, it } from 'vitest'
import { modules, questions, validateContent } from './content'

describe('curriculum', () => {
  it('has the agreed total and category split', () => {
    expect(validateContent()).toEqual({ questionCount: 250, categoryCounts: { probability: 200, statistics: 25, markets: 25 } })
  })

  it('matches every module allocation and covers all difficulty levels', () => {
    for (const module of modules) {
      const items = questions.filter(question => question.moduleId === module.id)
      expect(items).toHaveLength(module.questionCount)
      expect(new Set(items.map(question => question.difficulty))).toEqual(new Set([1, 2, 3, 4, 5]))
      expect(items.at(-1)?.phase).toBe('checkpoint')
    }
  })

  it('has stable unique IDs and complete learning support', () => {
    expect(new Set(questions.map(question => question.id)).size).toBe(250)
    for (const question of questions) {
      expect(question.hints.length).toBeGreaterThanOrEqual(2)
      expect(question.solution.steps.length).toBeGreaterThan(0)
      expect(question.solution.commonTrap.length).toBeGreaterThan(7)
      expect(question.source.url).toMatch(/^https:\/\//)
    }
  })
})
