import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DropdownDemo } from '../components/DropdownDemo'
import { demoItems } from '../components/dropdownDemo.data'
import { useDropdown } from '../hooks/useDropdown'

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

function SyncedStory() {
  const [mirror, setMirror] = useState(demoItems[0].label)
  const dropdown = useDropdown({
    items: demoItems,
    initialSelected: demoItems[0],
    id: 'storybook-synced',
    onSelect: (item) => {
      setMirror(item.label)
    },
  })

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.45)]">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="relative">
            <button
              {...dropdown.getToggleButtonProps({
                className:
                  'flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
              })}
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Story wrapper
                </span>
                <span className="block text-base font-semibold text-slate-950">
                  {dropdown.selectedItem?.label}
                </span>
              </span>
              <span className="text-sm font-medium text-slate-500">Open</span>
            </button>

            {dropdown.isOpen ? (
              <ul
                {...dropdown.getMenuProps({
                  className:
                    'absolute mt-3 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl',
                })}
              >
                {demoItems.map((item, index) => (
                  <li
                    key={item.id}
                    {...dropdown.getItemProps(item, index, {
                      className: [
                        'cursor-pointer rounded-xl px-3 py-3 text-sm transition',
                        dropdown.highlightedIndex === index
                          ? 'bg-slate-100 text-slate-950'
                          : 'text-slate-600',
                      ].join(' '),
                    })}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : null}
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
