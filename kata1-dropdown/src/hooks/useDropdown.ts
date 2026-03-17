import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type LiHTMLAttributes,
  type MouseEvent,
  type MutableRefObject,
  type Ref,
} from 'react'

type WithRef<T, E> = T & { ref?: Ref<E> }

type ToggleButtonProps = WithRef<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
type MenuProps = WithRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
type ItemProps = WithRef<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>

export interface UseDropdownProps<T> {
  items: T[]
  initialSelected?: T | null
  onSelect?: (item: T) => void
  id: string
}

export interface UseDropdownReturn<T> {
  isOpen: boolean
  selectedItem: T | null
  highlightedIndex: number
  getToggleButtonProps: (props?: ToggleButtonProps) => ToggleButtonProps
  getMenuProps: (props?: MenuProps) => MenuProps
  getItemProps: (item: T, index: number, props?: ItemProps) => ItemProps
}

function composeEventHandlers<E extends { defaultPrevented?: boolean }>(
  userHandler?: (event: E) => void,
  internalHandler?: (event: E) => void,
) {
  return (event: E) => {
    userHandler?.(event)

    if (!event.defaultPrevented) {
      internalHandler?.(event)
    }
  }
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === 'function') {
        ref(value)
        return
      }

      ;(ref as MutableRefObject<T | null>).current = value
    })
  }
}

export function useDropdown<T>({
  items,
  initialSelected = null,
  onSelect,
  id,
}: UseDropdownProps<T>): UseDropdownReturn<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(initialSelected)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLUListElement | null>(null)

  const selectedIndex = useMemo(
    () => items.findIndex((item) => Object.is(item, selectedItem)),
    [items, selectedItem],
  )

  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex)
  const triggerId = `${id}-trigger`
  const menuId = `${id}-menu`

  const getOpeningIndex = useCallback(
    (direction: 'start' | 'end' = 'start') => {
      if (items.length === 0) {
        return -1
      }

      if (selectedIndex >= 0) {
        return selectedIndex
      }

      return direction === 'end' ? items.length - 1 : 0
    },
    [items.length, selectedIndex],
  )

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setHighlightedIndex(selectedIndex)
  }, [selectedIndex])

  const openMenu = useCallback(
    (direction: 'start' | 'end' = 'start') => {
      setIsOpen(true)
      setHighlightedIndex(getOpeningIndex(direction))
    },
    [getOpeningIndex],
  )

  const moveHighlight = useCallback(
    (direction: 'next' | 'prev') => {
      if (items.length === 0) {
        setHighlightedIndex(-1)
        return
      }

      setHighlightedIndex((currentIndex) => {
        if (currentIndex < 0) {
          return direction === 'next' ? 0 : items.length - 1
        }

        const delta = direction === 'next' ? 1 : -1
        return (currentIndex + delta + items.length) % items.length
      })
    },
    [items.length],
  )

  const selectItem = useCallback(
    (item: T) => {
      const nextIndex = items.findIndex((candidate) => Object.is(candidate, item))
      setSelectedItem(item)
      setHighlightedIndex(nextIndex)
      setIsOpen(false)
      onSelect?.(item)
    },
    [items, onSelect],
  )

  const handleKeyboard = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          if (!isOpen) {
            openMenu('start')
            return
          }
          moveHighlight('next')
          return
        case 'ArrowUp':
          event.preventDefault()
          if (!isOpen) {
            openMenu('end')
            return
          }
          moveHighlight('prev')
          return
        case 'Enter':
          if (!isOpen) {
            event.preventDefault()
            openMenu('start')
            return
          }

          if (highlightedIndex >= 0) {
            event.preventDefault()
            selectItem(items[highlightedIndex])
          }
          return
        case 'Escape':
          if (isOpen) {
            event.preventDefault()
            closeMenu()
          }
          return
        default:
          return
      }
    },
    [closeMenu, highlightedIndex, isOpen, items, moveHighlight, openMenu, selectItem],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: globalThis.MouseEvent) => {
      const target = event.target as Node | null

      if (
        target &&
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [closeMenu, isOpen])

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) {
      return
    }

    itemRefs.current[highlightedIndex]?.scrollIntoView({
      block: 'nearest',
    })
  }, [highlightedIndex, isOpen])

  const getToggleButtonProps = useCallback(
    (props: ToggleButtonProps = {}) => {
      const { onClick, onKeyDown, ref, type, ...rest } = props

      return {
        ...rest,
        id: triggerId,
        type: type ?? 'button',
        'aria-expanded': isOpen,
        'aria-haspopup': 'listbox' as const,
        'aria-controls': menuId,
        ref: mergeRefs(triggerRef, ref),
        onClick: composeEventHandlers(
          onClick as ((event: MouseEvent<HTMLButtonElement>) => void) | undefined,
          () => {
            if (isOpen) {
              closeMenu()
              return
            }

            openMenu('start')
          },
        ),
        onKeyDown: composeEventHandlers(
          onKeyDown as
            | ((event: KeyboardEvent<HTMLButtonElement>) => void)
            | undefined,
          handleKeyboard as (event: KeyboardEvent<HTMLButtonElement>) => void,
        ),
      }
    },
    [closeMenu, handleKeyboard, isOpen, menuId, openMenu, triggerId],
  )

  const getMenuProps = useCallback(
    (props: MenuProps = {}) => {
      const { onKeyDown, ref, ...rest } = props

      return {
        ...rest,
        id: menuId,
        role: 'listbox',
        'aria-labelledby': triggerId,
        'aria-activedescendant':
          highlightedIndex >= 0 ? `${id}-item-${highlightedIndex}` : undefined,
        ref: mergeRefs(menuRef, ref),
        onKeyDown: composeEventHandlers(
          onKeyDown as ((event: KeyboardEvent<HTMLUListElement>) => void) | undefined,
          handleKeyboard as (event: KeyboardEvent<HTMLUListElement>) => void,
        ),
      }
    },
    [handleKeyboard, highlightedIndex, id, menuId, triggerId],
  )

  const getItemProps = useCallback(
    (item: T, index: number, props: ItemProps = {}) => {
      const { onClick, onKeyDown, onMouseMove, ref, ...rest } = props
      const isSelected = Object.is(selectedItem, item)
      const isHighlighted = highlightedIndex === index

      return {
        ...rest,
        id: `${id}-item-${index}`,
        role: 'option',
        tabIndex: -1,
        'aria-selected': isSelected,
        'data-highlighted': isHighlighted ? 'true' : undefined,
        'data-selected': isSelected ? 'true' : undefined,
        ref: mergeRefs<HTMLLIElement>(
          (node) => {
            itemRefs.current[index] = node
          },
          ref,
        ),
        onClick: composeEventHandlers(
          onClick as ((event: MouseEvent<HTMLLIElement>) => void) | undefined,
          () => {
            selectItem(item)
          },
        ),
        onMouseMove: composeEventHandlers(
          onMouseMove as ((event: MouseEvent<HTMLLIElement>) => void) | undefined,
          () => {
            setHighlightedIndex(index)
          },
        ),
        onKeyDown: composeEventHandlers(
          onKeyDown as ((event: KeyboardEvent<HTMLLIElement>) => void) | undefined,
          handleKeyboard as (event: KeyboardEvent<HTMLLIElement>) => void,
        ),
      }
    },
    [handleKeyboard, highlightedIndex, id, selectItem, selectedItem],
  )

  return {
    isOpen,
    selectedItem,
    highlightedIndex,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  }
}
