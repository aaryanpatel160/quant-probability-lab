import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProgressProvider } from '../context/ProgressContext'
import { MentalMathPage } from './MentalMathPage'

describe('MentalMathPage', () => {
  it('continues beyond the former 20-question limit', async () => {
    const user = userEvent.setup()
    render(<ProgressProvider><MentalMathPage /></ProgressProvider>)

    await user.click(screen.getByRole('button', { name: 'Start practising' }))
    for (let question = 1; question <= 20; question += 1) {
      await user.type(screen.getByLabelText('Mental maths answer'), '999999')
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: /Next/ }))
    }

    expect(screen.getByText('Question 21')).toBeInTheDocument()
    expect(screen.queryByText('SESSION COMPLETE')).not.toBeInTheDocument()
  }, 15_000)
})
