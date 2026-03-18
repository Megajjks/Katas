import { useState } from 'react'
import { Dropdown } from './components/Dropdown/Dropdown'
import { DropdownDemo } from './components/DropdownDemo/DropdownDemo'

interface Option {
  id: string
  label: string
}

interface TeamOption {
  id: string
  label: string
  role: string
  zone: string
  score: number
  accent: string
}

const pokemonTypeOptions: Option[] = [
  { id: 'fire', label: 'Fire' },
  { id: 'water', label: 'Water' },
  { id: 'grass', label: 'Grass' },
  { id: 'electric', label: 'Electric' },
  { id: 'psychic', label: 'Psychic' },
  { id: 'dragon', label: 'Dragon' },
]

const generationOptions: Option[] = [
  { id: 'gen-1', label: 'Generation I' },
  { id: 'gen-2', label: 'Generation II' },
  { id: 'gen-3', label: 'Generation III' },
  { id: 'gen-4', label: 'Generation IV' },
  { id: 'gen-5', label: 'Generation V' },
]

const statusOptions: Option[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'published', label: 'Published' },
  { id: 'archived', label: 'Archived' },
]

const teamOptions: TeamOption[] = [
  {
    id: 'brock',
    label: 'Brock',
    role: 'Gym Leader',
    zone: 'Pewter City',
    score: 92,
    accent: 'bg-amber-500',
  },
  {
    id: 'misty',
    label: 'Misty',
    role: 'Water Expert',
    zone: 'Cerulean City',
    score: 95,
    accent: 'bg-sky-500',
  },
  {
    id: 'erika',
    label: 'Erika',
    role: 'Grass Specialist',
    zone: 'Celadon City',
    score: 89,
    accent: 'bg-emerald-500',
  },
  {
    id: 'sabrina',
    label: 'Sabrina',
    role: 'Psychic Master',
    zone: 'Saffron City',
    score: 97,
    accent: 'bg-fuchsia-500',
  },
]

function App() {
  const [pokemonName, setPokemonName] = useState('Pikachu')
  const [attackName, setAttackName] = useState('Thunderbolt')
  const [pokemonType, setPokemonType] = useState<Option>(pokemonTypeOptions[3])
  const [pokemonGeneration, setPokemonGeneration] = useState<Option>(
    generationOptions[0],
  )
  const [assignedTrainer, setAssignedTrainer] = useState<TeamOption>(
    teamOptions[1],
  )

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Dropdown Design System
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            Dropdown Agnostico Playground
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            La logica de interaccion y accesibilidad vive en el hook
            <code className="ml-1 rounded bg-slate-100 px-2 py-0.5">
              useDropdown
            </code>
            . El componente base `Dropdown` solo expone una API reusable para
            el design system.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-12">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_90px_-45px_rgba(15,23,42,0.45)] md:p-6 lg:col-span-7">
            <h2 className="text-xl font-bold text-slate-950 md:text-2xl">
              Pokemon Form Example
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Formulario simple con inputs nativos y dos dropdowns atomicos:
              tipo y generacion.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Pokemon Name
                </span>
                <input
                  value={pokemonName}
                  onChange={(event) => {
                    setPokemonName(event.target.value)
                  }}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  placeholder="E.g. Charizard"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Attack
                </span>
                <input
                  value={attackName}
                  onChange={(event) => {
                    setAttackName(event.target.value)
                  }}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  placeholder="E.g. Flamethrower"
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Pokemon Type
                </span>
                <Dropdown
                  id="pokemon-type"
                  items={pokemonTypeOptions}
                  initialSelected={pokemonType}
                  onSelect={(option) => {
                    setPokemonType(option)
                  }}
                  getItemLabel={(option) => option.label}
                  style="primary"
                  variant="border"
                  color="brand"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Generation
                </span>
                <Dropdown
                  id="pokemon-generation"
                  items={generationOptions}
                  initialSelected={pokemonGeneration}
                  onSelect={(option) => {
                    setPokemonGeneration(option)
                  }}
                  getItemLabel={(option) => option.label}
                  style="secondary"
                  variant="light"
                  color="success"
                />
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-[0_25px_90px_-45px_rgba(15,23,42,0.65)] md:p-6 lg:col-span-5">
            <h2 className="text-xl font-bold text-white">Current Payload</h2>
            <p className="mt-2 text-sm text-slate-300">
              Simula el dato que enviaria el wrapper/padre al guardar el
              formulario.
            </p>
            <pre className="mt-4 overflow-auto rounded-2xl bg-white/10 p-4 text-xs leading-6 text-sky-100">
{`{
  "pokemonName": "${pokemonName}",
  "attack": "${attackName}",
  "type": "${pokemonType.label}",
  "generation": "${pokemonGeneration.label}"
}`}
            </pre>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_90px_-45px_rgba(15,23,42,0.45)] md:p-6 lg:col-span-4">
            <h2 className="text-lg font-bold text-slate-950 md:text-xl">
              Dropdown Variants
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Muestra `style`, `variant` y `color` en el atomo reusable.
            </p>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  default + border
                </p>
                <Dropdown
                  id="variant-default-border"
                  items={statusOptions}
                  initialSelected={statusOptions[0]}
                  getItemLabel={(option) => option.label}
                  style="default"
                  variant="border"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  primary + solid
                </p>
                <Dropdown
                  id="variant-primary-solid"
                  items={statusOptions}
                  initialSelected={statusOptions[1]}
                  getItemLabel={(option) => option.label}
                  style="primary"
                  variant="solid"
                  color="brand"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  secondary + light
                </p>
                <Dropdown
                  id="variant-secondary-light"
                  items={statusOptions}
                  initialSelected={statusOptions[2]}
                  getItemLabel={(option) => option.label}
                  style="secondary"
                  variant="light"
                  color="success"
                />
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_90px_-45px_rgba(15,23,42,0.45)] md:p-6 lg:col-span-4">
            <h2 className="text-lg font-bold text-slate-950 md:text-xl">
              Custom Item Component
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              El item del dropdown se renderiza como componente usando
              `renderItem`.
            </p>

            <div className="mt-4 space-y-3">
              <Dropdown
                id="trainer-assignment"
                items={teamOptions}
                initialSelected={assignedTrainer}
                onSelect={(trainer) => {
                  setAssignedTrainer(trainer)
                }}
                getItemLabel={(trainer) => trainer.label}
                style="primary"
                variant="light"
                color="brand"
                renderItem={({ item, isSelected, isHighlighted }) => (
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <span
                      className={`${item.accent} grid size-8 place-items-center rounded-full text-xs font-black text-white`}
                    >
                      {item.label.slice(0, 1)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {item.role} · {item.zone}
                      </span>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {isSelected ? 'picked' : isHighlighted ? 'hover' : `#${item.score}`}
                    </span>
                  </div>
                )}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Assigned trainer
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {assignedTrainer.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {assignedTrainer.role} · {assignedTrainer.zone}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_90px_-45px_rgba(15,23,42,0.45)] md:p-6 lg:col-span-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-950 md:text-2xl">
                Dropdown Demo: hook-driven logic
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Este bloque enfatiza el principio del sistema: la logica de
                apertura, seleccion, teclado y a11y vive en el hook, mientras la
                capa visual es configurable desde el componente atomico.
              </p>
            </div>
            <DropdownDemo variant="minimal" />
          </article>
        </section>
      </div>
    </main>
  )
}

export default App
