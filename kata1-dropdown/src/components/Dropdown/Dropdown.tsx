import { useDropdown } from '../../hooks/useDropdown'
import { getDropdownTheme } from './dropdown.theme'
import type { DropdownProps } from './dropdown.types'

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function Dropdown<T>({
  items,
  id,
  getItemLabel,
  initialSelected = null,
  onSelect,
  renderItem,
  style = 'default',
  variant = 'border',
  color,
  classNames,
  placeholder = 'Select an option',
  emptyMessage = 'No options',
}: DropdownProps<T>) {
  const dropdown = useDropdown({
    items,
    initialSelected,
    onSelect,
    id,
  })

  const theme = getDropdownTheme({ style, variant, color })

  return (
    <div className={cn('relative w-full', classNames?.root)}>
      <button
        {...dropdown.getToggleButtonProps({
          className: cn(
            'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500',
            theme.trigger,
            classNames?.trigger,
          ),
        })}
      >
        <span className="block truncate font-semibold">
          {dropdown.selectedItem ? getItemLabel(dropdown.selectedItem) : placeholder}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-full transition',
            theme.icon,
            dropdown.isOpen ? 'rotate-180' : '',
          )}
        >
          <svg viewBox="0 0 20 20" className="size-4 fill-current">
            <path d="M5.25 7.5 10 12.25 14.75 7.5" />
          </svg>
        </span>
      </button>

      {dropdown.isOpen ? (
        <ul
          {...dropdown.getMenuProps({
            className: cn(
              'absolute z-10 mt-3 max-h-80 w-full overflow-auto rounded-2xl border p-2',
              theme.menu,
              classNames?.menu,
            ),
          })}
        >
          {items.length === 0 ? (
            <li className="rounded-xl px-3 py-2 text-sm text-slate-500">
              {emptyMessage}
            </li>
          ) : (
            items.map((item, index) => {
              const isSelected = Object.is(dropdown.selectedItem, item)
              const isHighlighted = dropdown.highlightedIndex === index
              const label = getItemLabel(item)

              return (
                <li
                  key={`${id}-${index}-${label}`}
                  {...dropdown.getItemProps(item, index, {
                    className: cn(
                      'cursor-pointer rounded-xl px-3 py-3 text-sm transition ring-1 ring-inset ring-transparent',
                      theme.item,
                      isHighlighted && theme.highlighted,
                      isSelected && theme.selected,
                      classNames?.item,
                    ),
                  })}
                >
                  {renderItem
                    ? renderItem({
                        item,
                        index,
                        isSelected,
                        isHighlighted,
                        label,
                      })
                    : label}
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
