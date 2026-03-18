import type { ReactNode } from 'react'

export type DropdownStyle = 'default' | 'primary' | 'secondary'
export type DropdownVariant = 'solid' | 'border' | 'light'
export type DropdownColorToken =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'

export interface DropdownClassNames {
  root?: string
  trigger?: string
  menu?: string
  item?: string
}

export interface DropdownRenderItemContext<T> {
  item: T
  index: number
  isSelected: boolean
  isHighlighted: boolean
  label: string
}

export interface DropdownProps<T> {
  items: T[]
  id: string
  getItemLabel: (item: T) => string
  initialSelected?: T | null
  onSelect?: (item: T) => void
  renderItem?: (context: DropdownRenderItemContext<T>) => ReactNode
  style?: DropdownStyle
  variant?: DropdownVariant
  color?: DropdownColorToken
  classNames?: DropdownClassNames
  placeholder?: string
  emptyMessage?: string
}
