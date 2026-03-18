import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Dropdown } from '../Dropdown'
import { DropdownDemo } from './DropdownDemo'
import { demoItems } from './dropdownDemo.data'

const meta = {
  title: 'Showcase/DropdownDemo',
  component: DropdownDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hook de dropdown con render libre del trigger y de los items. El estilo de referencia usa Tailwind solo en el consumidor.',
      },
    },
  },
} satisfies Meta<typeof DropdownDemo>

export default meta

type Story = StoryObj<typeof meta>

export const Base: Story = {
  args: {},
}

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    showSyncPanel: false,
    helperText:
      'Misma logica del hook, otro tratamiento visual para el trigger y la lista.',
  },
}

export const Accent: Story = {
  args: {
    variant: 'accent',
    helperText:
      'Mismo atomo, pero usando estilo secondary + variante solid para alta jerarquia.',
  },
}

function SyncedStory() {
  const [mirror, setMirror] = useState(demoItems[0].label)

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.45)]">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="relative">
            <Dropdown
              id="storybook-synced"
              items={demoItems}
              initialSelected={demoItems[0]}
              onSelect={(item) => {
                setMirror(item.label)
              }}
              getItemLabel={(item) => item.label}
              style="primary"
              variant="border"
              color="brand"
              renderItem={({ item, isSelected }) => (
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {isSelected ? (
                    <span className="text-xs font-medium uppercase tracking-[0.2em]">
                      selected
                    </span>
                  ) : null}
                </div>
              )}
            />
          </div>

          <div className="rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">
              Sync mirror
            </p>
            <p className="mt-3 text-2xl font-semibold">{mirror}</p>
            <p className="mt-2 text-sm text-slate-300">
              `onSelect` mantiene una vista externa sincronizada.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SyncedWrapper: Story = {
  render: () => <SyncedStory />,
}
