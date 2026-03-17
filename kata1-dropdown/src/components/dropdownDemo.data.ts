export interface DemoItem {
  id: string
  label: string
  description: string
  badge: string
}

export const demoItems: DemoItem[] = [
  {
    id: 'react',
    label: 'React',
    description: 'Componentes declarativos para interfaces ricas.',
    badge: 'UI',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    description: 'Utilidades para componer un dropdown visualmente flexible.',
    badge: 'Styles',
  },
  {
    id: 'storybook',
    label: 'Storybook',
    description: 'Documentacion y playground para estados del componente.',
    badge: 'Docs',
  },
  {
    id: 'vitest',
    label: 'Vitest',
    description: 'Pruebas rapidas para el hook y el demo de integracion.',
    badge: 'Tests',
  },
]
