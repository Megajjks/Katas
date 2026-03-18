import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownDemo } from './DropdownDemo'

describe('DropdownDemo', () => {
  it('renderiza el dropdown estilo Tailwind y sincroniza el panel externo', async () => {
    const user = userEvent.setup()
    render(<DropdownDemo />)

    const trigger = screen.getByRole('button', { name: /tailwind css/i })

    expect(trigger.className).toContain('rounded-2xl')

    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: /storybook/i }))

    expect(screen.getByText('Ultimo valor emitido')).toBeInTheDocument()
    expect(screen.getAllByText('Storybook')[0]).toBeInTheDocument()
  })
})
