import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { questions } from '../data/content'
import { ProgressProvider } from '../context/ProgressContext'
import { QuestionCard } from './QuestionCard'

describe('QuestionCard', () => {
  it('reveals hints progressively and keeps the solution explicit', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ProgressProvider><QuestionCard question={questions[0]} /></ProgressProvider></MemoryRouter>)
    expect(screen.getByLabelText('Your answer')).toHaveAttribute('inputmode', 'text')
    expect(screen.queryByText('FULL EXPLANATION')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hint 1' }))
    expect(screen.getByText('Hint 1', { selector: 'strong' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show full solution' }))
    expect(screen.getByText('FULL EXPLANATION')).toBeInTheDocument()
  })
})
