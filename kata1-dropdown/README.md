# Kata 1: Dropdown Headless + Atomo de Design System

Proyecto React + TypeScript + Vite para construir un `Dropdown` reusable, agnostico de datos y con comportamiento accesible basado en hook.

## ✨ Objetivo
- Encapsular la logica de interaccion en `useDropdown`.
- Exponer un atomo `Dropdown<T>` para el design system.
- Permitir personalizacion visual por `style`, `variant` y `color`.
- Documentar y validar con pruebas unitarias y Storybook.

## 🧰 Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest + React Testing Library
- Storybook

## ⚒️ Arquitectura
- `useDropdown`:
  - Maneja apertura/cierre, seleccion, teclado, click-outside y a11y.
  - Expone `prop getters` (`getToggleButtonProps`, `getMenuProps`, `getItemProps`).
- `Dropdown<T>`:
  - Atomo reusable del design system que consume `useDropdown`.
  - Soporta `renderItem` para composicion de UI por parte del padre.
  - Sistema de estilos semantico:
    - `style`: `default | primary | secondary`
    - `variant`: `solid | border | light`
    - `color`: token semantico (`neutral`, `brand`, `success`, `warning`, `danger`)

## 💻 Scripts
```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run storybook
npm run build-storybook
```

## 🗂️ Estructura clave
- `src/hooks/useDropdown.ts`: hook headless con toda la logica.
- `src/components/Dropdown/`: atomo `Dropdown` + tipos + tema + tests + stories.
- `src/components/DropdownDemo/`: wrapper/demo para escenarios de negocio.
- `src/App.tsx`: playground tipo bento con ejemplos de uso reales.

## 📒 Documentos del repositorio
- [`spec.md`](./spec.md):
  - Fuente de verdad funcional y de comportamiento.
  - Define requerimientos mandatorios de accesibilidad, composicion y sincronizacion.
- [`plan-refinado.md`](./plan-refinado.md):
  - Plan de implementacion refinado por fases.
  - Incluye checklist de ejecucion y lineamientos de pruebas/storybook.
- [`log.md`](./log.md):
  - Bitacora cronologica de prompts, decisiones y cambios implementados.
  - Sirve como historial de ejecucion y trazabilidad tecnica.

## 🔗 URLs de despliegue
- App desplegada: `https://taupe-stardust-fe770f.netlify.app/`
- Storybook desplegado: `https://zingy-sorbet-c50754.netlify.app/`
