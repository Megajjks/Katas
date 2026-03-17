import { DropdownDemo } from './components/DropdownDemo'

function App() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-800">
            Kata 1
          </p>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Dropdown custom con hook, tests y Storybook
            </h1>
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              Esta app reemplaza el boilerplate de Vite por una implementacion
              guiada por `spec.md`: logica reusable, a11y, estilos con
              Tailwind y documentacion visual para seguir iterando.
            </p>
          </div>
        </header>

        <DropdownDemo />
      </div>
    </main>
  )
}

export default App
