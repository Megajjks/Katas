import { useState } from 'react'
import { demoItems } from './dropdownDemo.data'
import { Dropdown } from '../Dropdown/Dropdown'
import type {
  DropdownColorToken,
  DropdownStyle,
  DropdownVariant,
} from '../Dropdown/dropdown.types'

type Variant = 'default' | 'minimal' | 'accent'

export interface DropdownDemoProps {
  title?: string
  helperText?: string
  variant?: Variant
  showSyncPanel?: boolean
}

const variantMap: Record<
  Variant,
  { style: DropdownStyle; variant: DropdownVariant; color?: DropdownColorToken }
> = {
  default: { style: 'primary', variant: 'border', color: 'brand' },
  minimal: { style: 'default', variant: 'light', color: 'neutral' },
  accent: { style: 'secondary', variant: 'solid' },
}

export function DropdownDemo({
  title = 'Dropdown agnostico con logica reusable',
  helperText = 'El estilo vive en el consumidor; el hook solo coordina estado, teclado y accesibilidad.',
  variant = 'default',
  showSyncPanel = true,
}: DropdownDemoProps) {
  const [syncedLabel, setSyncedLabel] = useState(demoItems[1].label)
  const dropdownConfig = variantMap[variant]

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
          <Dropdown
            id="stack-selector"
            items={demoItems}
            initialSelected={demoItems[1]}
            onSelect={(item) => {
              setSyncedLabel(item.label)
            }}
            getItemLabel={(item) => item.label}
            style={dropdownConfig.style}
            variant={dropdownConfig.variant}
            color={dropdownConfig.color}
            placeholder="Selecciona una opcion"
            renderItem={({ item, isSelected }) => (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                  {item.badge}
                </span>
                <span className="min-w-0 space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {item.label}
                    {isSelected ? (
                      <span className="text-xs font-medium text-sky-400">actual</span>
                    ) : null}
                  </span>
                  <span className="block text-sm leading-5 text-slate-500">
                    {item.description}
                  </span>
                </span>
              </div>
            )}
          />
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
