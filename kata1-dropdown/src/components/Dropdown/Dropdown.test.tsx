import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from './Dropdown'

type Item = { id: string; label: string }

const items: Item[] = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'svelte', label: 'Svelte' },
]

describe('Dropdown atom', () => {
  it('renderiza con getItemLabel y seleccion inicial', () => {
    render(
      <Dropdown
        id="frameworks"
        items={items}
        initialSelected={items[1]}
        getItemLabel={(item) => item.label}
      />,
    )

    expect(screen.getByRole('button', { name: 'Vue' })).toBeInTheDocument()
  })

  it('selecciona item, cierra menu y llama onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <Dropdown
        id="frameworks"
        items={items}
        initialSelected={items[1]}
        getItemLabel={(item) => item.label}
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Vue' }))
    await user.click(screen.getByRole('option', { name: 'React' }))

    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onSelect).toHaveBeenCalledWith(items[0])
  })

  it('soporta teclado y click outside con atributos a11y', async () => {
    const user = userEvent.setup()

    render(
      <div>
        <Dropdown
          id="frameworks"
          items={items}
          initialSelected={items[1]}
          getItemLabel={(item) => item.label}
        />
        <button type="button">Outside</button>
      </div>,
    )

    const trigger = screen.getByRole('button', { name: 'Vue' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Svelte' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Svelte' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Svelte' }))
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('aplica fallback de color por style y permite override por token', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <Dropdown
        id="styles-fallback"
        items={items}
        initialSelected={items[0]}
        getItemLabel={(item) => item.label}
        style="primary"
        variant="solid"
      />,
    )

    let trigger = screen.getByRole('button', { name: 'React' })
    expect(trigger.className).toContain('bg-sky-600')

    rerender(
      <Dropdown
        id="styles-fallback"
        items={items}
        initialSelected={items[0]}
        getItemLabel={(item) => item.label}
        style="primary"
        variant="light"
        color="danger"
      />,
    )

    trigger = screen.getByRole('button', { name: 'React' })
    expect(trigger.className).toContain('bg-rose-100')

    await user.click(trigger)
    const option = screen.getByRole('option', { name: 'React' })
    expect(option.className).toContain('ring-rose-300')
  })

  it('permite renderItem custom conservando estado seleccionado', async () => {
    const user = userEvent.setup()

    render(
      <Dropdown
        id="custom-render"
        items={items}
        initialSelected={items[2]}
        getItemLabel={(item) => item.label}
        renderItem={({ item, isSelected }) => (
          <div>
            <span>{item.label}</span>
            {isSelected ? <span> selected</span> : null}
          </div>
        )}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Svelte' }))
    expect(screen.getByRole('option', { name: /svelte\s*selected/i })).toBeInTheDocument()
  })
})
