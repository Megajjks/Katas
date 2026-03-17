import { useState } from 'react'
import { demoItems } from './dropdownDemo.data'
import { useDropdown } from '../hooks/useDropdown'

type Variant = 'default' | 'minimal'

export interface DropdownDemoProps {
  title?: string
  helperText?: string
  variant?: Variant
  showSyncPanel?: boolean
}

const baseTriggerClasses =
  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2'

const variantClasses: Record<Variant, string> = {
  default:
    'border-slate-200 bg-white/95 shadow-[0_20px_70px_-32px_rgba(15,23,42,0.45)] hover:border-slate-300',
  minimal:
    'border-slate-300 bg-slate-50 text-slate-900 hover:bg-white',
}

export function DropdownDemo({
  title = 'Dropdown agnostico con logica reusable',
  helperText = 'El estilo vive en el consumidor; el hook solo coordina estado, teclado y accesibilidad.',
  variant = 'default',
  showSyncPanel = true,
}: DropdownDemoProps) {
  const [syncedLabel, setSyncedLabel] = useState(demoItems[1].label)

  const dropdown = useDropdown({
    items: demoItems,
    initialSelected: demoItems[1],
    id: 'stack-selector',
    onSelect: (item) => {
      setSyncedLabel(item.label)
    },
  })

  return (
    <section className="grid gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-5">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
            Tailwind style
          </span>
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              {helperText}
            </p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <button
            {...dropdown.getToggleButtonProps({
              className: `${baseTriggerClasses} ${variantClasses[variant]}`,
            })}
          >
            <span className="space-y-1">
              <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Stack base
              </span>
              <span className="block text-base font-semibold text-slate-950">
                {dropdown.selectedItem?.label ?? 'Selecciona una opcion'}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={`grid size-10 place-items-center rounded-full bg-slate-900 text-white transition ${
                dropdown.isOpen ? 'rotate-180' : ''
              }`}
            >
              <svg viewBox="0 0 20 20" className="size-4 fill-current">
                <path d="M5.25 7.5 10 12.25 14.75 7.5" />
              </svg>
            </span>
          </button>

          {dropdown.isOpen ? (
            <ul
              {...dropdown.getMenuProps({
                className:
                  'absolute z-10 mt-3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_32px_90px_-36px_rgba(15,23,42,0.45)]',
              })}
            >
              {demoItems.map((item, index) => {
                const isSelected = dropdown.selectedItem?.id === item.id
                const isHighlighted = dropdown.highlightedIndex === index

                return (
                  <li
                    key={item.id}
                    {...dropdown.getItemProps(item, index, {
                      className: [
                        'flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition',
                        isHighlighted ? 'bg-slate-100' : 'bg-white',
                        isSelected
                          ? 'text-slate-950 ring-1 ring-inset ring-sky-200'
                          : 'text-slate-700',
                      ].join(' '),
                    })}
                  >
                    <span className="mt-0.5 inline-flex rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                      {item.badge}
                    </span>
                    <span className="min-w-0 space-y-1">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {item.label}
                        {isSelected ? (
                          <span className="text-xs font-medium text-sky-700">
                            actual
                          </span>
                        ) : null}
                      </span>
                      <span className="block text-sm leading-5 text-slate-500">
                        {item.description}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </div>

      {showSyncPanel ? (
        <aside className="rounded-[1.5rem] bg-slate-950 p-5 text-slate-100">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Bidireccional
          </p>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-400">
              `onSelect` sincroniza el cambio con estado externo sin acoplar el
              estilo del dropdown.
            </p>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Ultimo valor emitido
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {syncedLabel}
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Click outside cierra el panel.</li>
              <li>Flechas y Enter recorren las opciones.</li>
              <li>Escape restaura un estado cerrado.</li>
            </ul>
          </div>
        </aside>
      ) : null}
    </section>
  )
}
