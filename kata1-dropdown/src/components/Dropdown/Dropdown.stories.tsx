import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from './Dropdown'
import { demoItems } from '../DropdownDemo/dropdownDemo.data'
import type { DemoItem } from './dropdown.data'
import type { DropdownProps } from './dropdown.types'

type DemoItemDropdownProps = Omit<
  DropdownProps<DemoItem>,
  'getItemLabel' | 'items'
> & {
  items?: DemoItem[]
  getItemLabel?: (item: DemoItem) => string
}

function DemoItemDropdown({
  getItemLabel = (item) => item.label,
  items = demoItems,
  ...props
}: DemoItemDropdownProps) {
  return (
    <div className="w-[320px]">
      <Dropdown<DemoItem> items={items} getItemLabel={getItemLabel} {...props} />
    </div>
  )
}

const meta = {
  title: 'Design System/Dropdown',
  component: DemoItemDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Atomo Dropdown basado en useDropdown. El padre define data y puede inyectar render de item; el atomo aporta accesibilidad, interacciones y un sistema semantico de estilo/variant/color.',
      },
    },
  },
  argTypes: {
    style: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'border', 'light'],
    },
    color: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof DemoItemDropdown>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    id: 'dropdown-playground',
    initialSelected: demoItems[1],
    style: 'default',
    variant: 'border',
    color: 'neutral',
  },
}

export const StyleMatrix: Story = {
  args: {
    id: 'matrix-base',
  },
  render: () => (
    <div className="grid w-[980px] grid-cols-3 gap-5">
      <Dropdown
        id="matrix-default-solid"
        items={demoItems}
        initialSelected={demoItems[0]}
        getItemLabel={(item) => item.label}
        style="default"
        variant="solid"
      />
      <Dropdown
        id="matrix-primary-border"
        items={demoItems}
        initialSelected={demoItems[1]}
        getItemLabel={(item) => item.label}
        style="primary"
        variant="border"
      />
      <Dropdown
        id="matrix-secondary-light"
        items={demoItems}
        initialSelected={demoItems[2]}
        getItemLabel={(item) => item.label}
        style="secondary"
        variant="light"
      />
    </div>
  ),
}

export const CustomRenderItem: Story = {
  args: {
    id: 'dropdown-custom',
    initialSelected: demoItems[3],
    style: 'primary',
    variant: 'light',
    color: 'brand',
    renderItem: ({ item, isSelected, isHighlighted }) => (
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          {item.badge}
        </span>
        <div>
          <p className="text-sm font-semibold">{item.label}</p>
          <p className="text-xs text-slate-500">{item.description}</p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {isSelected ? 'selected' : isHighlighted ? 'active' : 'idle'}
        </span>
      </div>
    ),
  },
}
