import type {
  DropdownColorToken,
  DropdownStyle,
  DropdownVariant,
} from './dropdown.types'

interface DropdownTheme {
  trigger: string
  menu: string
  item: string
  selected: string
  highlighted: string
  icon: string
}

const defaultColorByStyle: Record<DropdownStyle, DropdownColorToken> = {
  default: 'neutral',
  primary: 'brand',
  secondary: 'success',
}

const variantTheme: Record<DropdownVariant, Record<DropdownColorToken, DropdownTheme>> =
  {
    solid: {
      neutral: {
        trigger:
          'border-slate-900 bg-slate-900 text-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.65)] hover:bg-slate-800',
        menu: 'border-slate-200 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-slate-900 text-white ring-slate-900/20',
        highlighted: 'bg-slate-100',
        icon: 'bg-white/15 text-white',
      },
      brand: {
        trigger:
          'border-sky-600 bg-sky-600 text-white shadow-[0_18px_50px_-30px_rgba(2,132,199,0.7)] hover:bg-sky-500',
        menu: 'border-sky-200/70 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-sky-600 text-white ring-sky-200',
        highlighted: 'bg-sky-50',
        icon: 'bg-white/20 text-white',
      },
      success: {
        trigger:
          'border-emerald-600 bg-emerald-600 text-white shadow-[0_18px_50px_-30px_rgba(5,150,105,0.75)] hover:bg-emerald-500',
        menu: 'border-emerald-200/70 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-emerald-600 text-white ring-emerald-200',
        highlighted: 'bg-emerald-50',
        icon: 'bg-white/20 text-white',
      },
      warning: {
        trigger:
          'border-amber-500 bg-amber-500 text-slate-950 shadow-[0_18px_50px_-30px_rgba(245,158,11,0.75)] hover:bg-amber-400',
        menu: 'border-amber-200/80 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-amber-500 text-slate-900 ring-amber-200',
        highlighted: 'bg-amber-50',
        icon: 'bg-black/10 text-slate-900',
      },
      danger: {
        trigger:
          'border-rose-600 bg-rose-600 text-white shadow-[0_18px_50px_-30px_rgba(225,29,72,0.75)] hover:bg-rose-500',
        menu: 'border-rose-200/70 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-rose-600 text-white ring-rose-200',
        highlighted: 'bg-rose-50',
        icon: 'bg-white/20 text-white',
      },
    },
    border: {
      neutral: {
        trigger:
          'border-slate-300 bg-white text-slate-900 shadow-sm hover:border-slate-400',
        menu: 'border-slate-200 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-slate-900 text-white ring-slate-900/20',
        highlighted: 'bg-slate-100',
        icon: 'bg-slate-100 text-slate-700',
      },
      brand: {
        trigger:
          'border-sky-400 bg-white text-sky-900 shadow-sm hover:border-sky-500',
        menu: 'border-sky-200 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-sky-600 text-white ring-sky-200',
        highlighted: 'bg-sky-50',
        icon: 'bg-sky-100 text-sky-700',
      },
      success: {
        trigger:
          'border-emerald-400 bg-white text-emerald-900 shadow-sm hover:border-emerald-500',
        menu: 'border-emerald-200 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-emerald-600 text-white ring-emerald-200',
        highlighted: 'bg-emerald-50',
        icon: 'bg-emerald-100 text-emerald-700',
      },
      warning: {
        trigger:
          'border-amber-400 bg-white text-amber-900 shadow-sm hover:border-amber-500',
        menu: 'border-amber-200 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-amber-500 text-slate-900 ring-amber-200',
        highlighted: 'bg-amber-50',
        icon: 'bg-amber-100 text-amber-800',
      },
      danger: {
        trigger:
          'border-rose-400 bg-white text-rose-900 shadow-sm hover:border-rose-500',
        menu: 'border-rose-200 bg-white text-slate-900 shadow-xl',
        item: 'text-slate-700',
        selected: 'bg-rose-600 text-white ring-rose-200',
        highlighted: 'bg-rose-50',
        icon: 'bg-rose-100 text-rose-700',
      },
    },
    light: {
      neutral: {
        trigger:
          'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
        menu: 'border-slate-200 bg-white text-slate-900 shadow-lg',
        item: 'text-slate-700',
        selected: 'bg-slate-200 text-slate-950 ring-slate-300',
        highlighted: 'bg-slate-100',
        icon: 'bg-slate-200 text-slate-700',
      },
      brand: {
        trigger:
          'border-transparent bg-sky-100 text-sky-900 hover:bg-sky-200',
        menu: 'border-sky-200 bg-white text-slate-900 shadow-lg',
        item: 'text-slate-700',
        selected: 'bg-sky-200 text-sky-950 ring-sky-300',
        highlighted: 'bg-sky-50',
        icon: 'bg-sky-200 text-sky-800',
      },
      success: {
        trigger:
          'border-transparent bg-emerald-100 text-emerald-900 hover:bg-emerald-200',
        menu: 'border-emerald-200 bg-white text-slate-900 shadow-lg',
        item: 'text-slate-700',
        selected: 'bg-emerald-200 text-emerald-950 ring-emerald-300',
        highlighted: 'bg-emerald-50',
        icon: 'bg-emerald-200 text-emerald-800',
      },
      warning: {
        trigger:
          'border-transparent bg-amber-100 text-amber-900 hover:bg-amber-200',
        menu: 'border-amber-200 bg-white text-slate-900 shadow-lg',
        item: 'text-slate-700',
        selected: 'bg-amber-200 text-amber-950 ring-amber-300',
        highlighted: 'bg-amber-50',
        icon: 'bg-amber-200 text-amber-800',
      },
      danger: {
        trigger:
          'border-transparent bg-rose-100 text-rose-900 hover:bg-rose-200',
        menu: 'border-rose-200 bg-white text-slate-900 shadow-lg',
        item: 'text-slate-700',
        selected: 'bg-rose-200 text-rose-950 ring-rose-300',
        highlighted: 'bg-rose-50',
        icon: 'bg-rose-200 text-rose-800',
      },
    },
  }

export function getDropdownTheme(options: {
  style: DropdownStyle
  variant: DropdownVariant
  color?: DropdownColorToken
}) {
  const color = options.color ?? defaultColorByStyle[options.style]
  return variantTheme[options.variant][color]
}
