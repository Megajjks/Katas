# Plan Refinado: Dropdown Agnostico de UI con Hook, Tests, Storybook y Tailwind

## Checklist de ejecucion
- [x] Instalar Storybook en el proyecto Vite React TS.
- [x] Instalar Tailwind CSS y dependencias de testing compatibles con `vite@8`.
- [x] Configurar Tailwind, Vitest y scripts de desarrollo.
- [x] Implementar contratos y hook `useDropdown`.
- [x] Crear demo React con estilo visual tipo Tailwind.
- [x] Agregar pruebas unitarias del hook y del demo.
- [x] Crear stories y docs base en Storybook.
- [x] Ejecutar validaciones finales (`lint`, `test`, `build`, `build-storybook`) y marcar el cierre.

## Resumen
Construir un `useDropdown` generico en React + TypeScript tomando `spec.md` como fuente de verdad. La solucion debe separar por completo logica y presentacion: el hook expone estado y prop-getters; el componente padre decide render del trigger y de los items. El trabajo se hara con enfoque spec-driven, usando `Vitest + React Testing Library` y `renderHook` actual, mas `Storybook` con historias documentadas. El proyecto debe instalar y configurar `Tailwind CSS` para que el demo y las stories usen un estilo de dropdown tipo Tailwind sin acoplar la logica del hook a una implementacion visual fija.

## Cambios de implementacion
- Reemplazar el boilerplate de Vite por una estructura minima orientada al kata: hook reusable, componente demo y carpeta de pruebas.
- Instalar y configurar `Tailwind CSS` en Vite:
  - dependencias, configuracion base y carga de estilos globales.
  - dejar el proyecto listo para usar utilidades Tailwind en app y Storybook.
- Definir primero los contratos TypeScript sin logica:
  - `UseDropdownProps<T>` con `items`, `initialSelected`, `onSelect`, `id`.
  - `UseDropdownReturn<T>` con `isOpen`, `selectedItem`, `highlightedIndex`, `getToggleButtonProps`, `getMenuProps`, `getItemProps`.
- Fijar el contrato de prop-getters para que acepten props externas opcionales y compongan handlers del consumidor con los internos del hook.
- Implementar el hook como pieza principal de logica:
  - estado local para apertura, seleccion y navegacion.
  - refs para trigger, menu y coleccion de items.
  - cierre por seleccion, `Escape` y click-outside.
  - navegacion con teclado por flechas y seleccion con `Enter`.
  - memoria visual de seleccion al abrir: `highlightedIndex` debe alinearse con el item actualmente seleccionado.
  - a11y minima consistente con el spec: trigger con `aria-expanded`, `aria-haspopup`, `aria-controls`; menu con `role="listbox"` e `id`; items con `role="option"` y `aria-selected`.
- Crear un componente demo de React que consuma el hook via renderizacion libre del trigger y de la lista para demostrar la composicion pedida por el spec.
- Aplicar al demo una apariencia visual estilo Tailwind para un dropdown moderno:
  - trigger con borde, fondo, focus ring y estado abierto/cerrado.
  - panel con sombra, borde, espaciado y feedback visual del item seleccionado y resaltado.
  - estilos implementados solo en el consumidor demo/stories, no dentro del hook.
- Anadir Storybook para documentar y validar integracion:
  - una historia base con dropdown simple.
  - una historia mostrando trigger/item customizados.
  - una historia con estado controlado desde un wrapper para evidenciar la sincronizacion via `onSelect`.
  - docs page breve explicando contratos, accesibilidad, patron de uso y como se aplica Tailwind al consumidor.
- Actualizar scripts del proyecto para desarrollo y validacion:
  - `test`, `test:watch`, `test:coverage`
  - `storybook`, `build-storybook`

## Contratos y decisiones cerradas
- El hook sera generico: `useDropdown<T>(props: UseDropdownProps<T>)`.
- `initialSelected` se tratara como valor inicial, no como prop controlada reactiva; la sincronizacion bidireccional exigida por el spec se cumple mediante actualizacion interna + emision de `onSelect`.
- La identificacion visual del seleccionado al abrir se resuelve resaltando el indice del `selectedItem`.
- Los prop-getters devolveran los atributos minimos necesarios y permitiran merge de props del consumidor sin sobrescribir la logica interna.
- El hook seguira siendo agnostico a estilos; Tailwind solo se usara en el componente demo, la app de ejemplo y las stories.
- El look & feel de referencia sera el de un dropdown clasico de Tailwind: superficie clara, bordes suaves, sombra, estados hover/focus y realce visual del item activo/seleccionado.
- Testing stack:
  - `Vitest`
  - `@testing-library/react`
  - `@testing-library/user-event`
  - `jsdom`
- Storybook scope:
  - stories funcionales
  - documentacion basica
  - sin interaction tests en esta fase

## Plan de pruebas
- Hook, estado base:
  - inicia cerrado
  - expone `selectedItem` igual a `initialSelected`
  - al abrir, `highlightedIndex` apunta al item seleccionado actual
- Trigger:
  - click alterna `isOpen`
  - refleja `aria-expanded` segun estado
  - expone `aria-haspopup` y `aria-controls`
  - compone `onClick` y `onKeyDown` del consumidor
- Seleccion:
  - click en item actualiza `selectedItem`
  - click en item cierra el menu
  - click en item llama `onSelect` con el valor correcto
- Teclado:
  - `ArrowDown` y `ArrowUp` mueven `highlightedIndex`
  - `Enter` selecciona el item resaltado y cierra
  - `Escape` cierra
- Click-outside:
  - `mousedown` fuera de trigger y menu cierra
  - `mousedown` dentro no cierra accidentalmente
- Integracion React:
  - un componente consumidor renderiza trigger e items personalizados usando los prop-getters
  - el item seleccionado se marca visualmente sin requerir estilos del hook
- Estilos:
  - la app y Storybook cargan Tailwind correctamente
  - el dropdown demo renderiza clases utilitarias esperadas sin romper accesibilidad ni comportamiento
- Storybook:
  - cada historia monta sin errores
  - la documentacion refleja contratos y comportamiento esperado

## Suposiciones y defaults
- Guardar el plan final en `plan-refinado.md`.
- No se usara `testing-library/react-hooks`; se sustituye por `renderHook` de React Testing Library por compatibilidad con React moderno y Vite.
- No se introducira control total por prop `selectedItem` en esta fase porque no esta en el spec; si luego quieres modo controlado/no controlado dual, eso requiere ampliar el contrato.
- No se definira virtualizacion, busqueda, multiseleccion ni posicionamiento flotante; quedan fuera del alcance del spec actual.
- El implementador debe eliminar el contenido demo por defecto de Vite y dejar una app minima que exhiba el dropdown del kata.
- La configuracion de Tailwind tambien debe quedar disponible para Storybook desde el inicio para evitar divergencias visuales entre app y documentacion.
