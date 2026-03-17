import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDropdown } from './useDropdown'

const items = ['React', 'Vue', 'Svelte']

function HookHarness(props: {
  onSelect?: (item: string) => void
  onTriggerClick?: () => void
  onTriggerKeyDown?: () => void
}) {
  const dropdown = useDropdown({
    items,
    initialSelected: 'Vue',
    id: 'framework-dropdown',
    onSelect: props.onSelect,
  })

  return (
    <div>
      <button
        {...dropdown.getToggleButtonProps({
          onClick: props.onTriggerClick,
          onKeyDown: props.onTriggerKeyDown,
        })}
      >
        {dropdown.selectedItem}
      </button>

      <div data-testid="highlighted-index">{dropdown.highlightedIndex}</div>

      {dropdown.isOpen ? (
        <ul {...dropdown.getMenuProps()}>
          {items.map((item, index) => (
            <li key={item} {...dropdown.getItemProps(item, index)}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

describe('useDropdown', () => {
  it('inicializa cerrado y con el valor seleccionado por defecto', () => {
    const { result } = renderHook(() =>
      useDropdown({
        items,
        initialSelected: 'Vue',
        id: 'framework-dropdown',
      }),
    )

    expect(result.current.isOpen).toBe(false)
    expect(result.current.selectedItem).toBe('Vue')
    expect(result.current.highlightedIndex).toBe(1)
  })

  it('alterna el trigger y actualiza atributos aria', async () => {
    const user = userEvent.setup()
    render(<HookHarness />)

    const trigger = screen.getByRole('button', { name: 'Vue' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selecciona un item, cierra y dispara onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(<HookHarness onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Vue' }))
    await user.click(screen.getByRole('option', { name: 'React' }))

    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onSelect).toHaveBeenCalledWith('React')
  })

  it('navega con teclado y selecciona con Enter', async () => {
    const user = userEvent.setup()
    render(<HookHarness />)

    const trigger = screen.getByRole('button', { name: 'Vue' })

    await user.click(trigger)
    await user.keyboard('{ArrowDown}')

    expect(screen.getByTestId('highlighted-index')).toHaveTextContent('2')

    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: 'Svelte' })).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('cierra con Escape y con click fuera', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <HookHarness />
        <button type="button">Outside</button>
      </div>,
    )

    await user.click(screen.getByRole('button', { name: 'Vue' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Vue' }))
    await user.click(screen.getByRole('button', { name: 'Outside' }))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('compone handlers del consumidor con la logica interna', async () => {
    const user = userEvent.setup()
    const onTriggerClick = vi.fn()
    const onTriggerKeyDown = vi.fn()

    render(
      <HookHarness
        onTriggerClick={onTriggerClick}
        onTriggerKeyDown={onTriggerKeyDown}
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Vue' })

    await user.click(trigger)
    await user.keyboard('{ArrowDown}')

    expect(onTriggerClick).toHaveBeenCalledTimes(1)
    expect(onTriggerKeyDown).toHaveBeenCalled()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})
