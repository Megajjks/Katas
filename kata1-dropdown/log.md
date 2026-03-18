--

autor: "Jayro Ku"
version: 1.0

--

# Logs
**Fecha:** 2026-03-16
**Hora:** 14:33:59 CST
**Autor:** Gemini
**Prompt:** vamos a analizar este requerimiento de un componente orientado a un design system. quiero que me des tres propuestas con los patrones y arquitecturas a usar con los contras y pros, el stack que deseo usar es reactjs, sin embargo no quiero nada de codigo por ahora solo es para analizar desde alto nivel

**Output:**

### Propuesta 1: Componentes Compuestos (Compound Components) con Context API
Este patrón divide el dropdown en múltiples sub-componentes (ej. `<Dropdown>`, `<Dropdown.Trigger>`, `<Dropdown.List>`, `<Dropdown.Item>`) que comparten estado implícitamente a través de un React Context cerrado.

* **Pros:**
    * **Excelente legibilidad:** La estructura del JSX final es muy declarativa.
    * **Inversión de control visual:** El desarrollador padre decide el orden de los elementos sin alterar la lógica interna.
    * **Ideal para Design Systems:** Es el estándar actual (usado por bibliotecas como Radix o Headless UI) porque encapsula la accesibilidad (a11y) y la navegación por teclado entre las partes conectadas.
* **Contras:**
    * Mayor complejidad inicial de arquitectura para configurar el Context y asegurar que no haya renderizados innecesarios.
    * Requiere validaciones estrictas para asegurar que los sub-componentes no se usen fuera del componente padre principal.

### Propuesta 2: Componente "Headless" (Custom Hooks)
Consiste en abstraer toda la lógica de estado, sincronización, memoria de selección y manejadores de eventos (teclado, click-outside) en un hook puro (ej. `useDropdown`). El hook devuelve el estado actual y funciones "getter" para esparcir los atributos necesarios en los elementos HTML.

* **Pros:**
    * **Agnosticismo total:** Cero interfaz gráfica acoplada. Es la arquitectura más flexible posible para el diseño.
    * **Reutilización extrema:** La misma lógica sirve para un dropdown web, un select nativo simulado o incluso portarlo a React Native cambiando solo la capa de vista.
* **Contras:**
    * La API de consumo puede ser intimidante para los desarrolladores si tienen que esparcir múltiples `props` manualmente en cada elemento.
    * Delega la estructura completa del DOM al desarrollador que lo implementa, lo que podría romper la accesibilidad si olvidan renderizar partes clave.

### Propuesta 3: Render Props / Function as a Child
El componente principal actúa como una caja negra para la lógica, pero expone funciones mediante `props` (ej. `renderTrigger`, `renderItem`) o a través de `children` como función. Estas funciones inyectan el estado actual (si está abierto, qué item está seleccionado) para que el padre decida qué pintar.

* **Pros:**
    * **Control granular:** Muy fácil pasar datos específicos del estado interno directamente a la vista del trigger o del item.
    * **Menos sobrecarga estructural:** No requiere configurar Context API, todo se maneja mediante el paso de argumentos en las funciones de renderizado.
* **Contras:**
    * **"Callback Hell" en JSX:** El código puede volverse profundo, anidado y difícil de leer si hay demasiadas propiedades de renderizado.
    * Patrón menos escalable visualmente en ecosistemas modernos comparado con los Componentes Compuestos.

---

**Fecha:** 2026-03-16
**Hora:** 14:41:12 CST
**Autor:** Gemini
**Prompt:** de las tres propuestas quiero que me hagas una tabla de analisis tomando en cuenta los requerimientos del spec que son mandatorios, requiero que la tabla sea muy especifica en lo tecnico, los contras, pros, el impacto al performance, la escalabilidad y grado de complejidad.

**Output:**

A continuación, la tabla comparativa evaluando las tres arquitecturas frente a los requerimientos mandatorios del `spec.md` (agnosticismo, sincronización bidireccional, slots/render-props, memoria de selección, a11y, navegación por teclado, click-outside y escape).

| Propuesta | Detalles Técnicos vs Spec | Pros | Contras | Impacto Performance | Escalabilidad | Complejidad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Compound Components + Context** | **Composición:** Usa `<Dropdown.Trigger>` y `<Dropdown.Item>`.<br>**A11y/Teclado:** El Context comparte los `refs` de los items y el trigger para manejar el foco y las teclas (flechas/Esc).<br>**Sync:** Estado centralizado en el Provider (flujo bidireccional mediante `value` y `onChange` en el padre).<br>**Memoria:** El Context informa a `<Dropdown.Item>` si su valor coincide con el seleccionado. | - API declarativa y limpia.<br>- Encapsula la gestión de `refs` para la navegación por teclado (Enter, Flechas) sin exponerla al usuario.<br>- Manejo centralizado del click-outside en el contenedor principal. | - Requiere un Context provider que puede causar re-renders innecesarios si no se memorizan los valores (`useMemo`).<br>- Mayor acoplamiento de la estructura del DOM. | **Medio**. Los cambios en el Context re-renderizan todos los sub-componentes a menos que se aplique memoización estricta (`React.memo`). | **Alta**. Es fácil agregar nuevos sub-componentes (ej. `<Dropdown.Group>`, `<Dropdown.Search>`) compartiendo el mismo contexto. | **Media-Alta**. Requiere gestionar un sistema de registro de `refs` de los items dentro del Context para la navegación por teclado. |
| **2. Headless (Custom Hooks)** | **Composición:** Agnosticismo total. El padre renderiza todo.<br>**A11y/Teclado:** El hook retorna funciones `getTriggerProps()` y `getItemProps()` que inyectan `aria-attributes`, `tabIndex` y manejadores `onKeyDown`.<br>**Sync/Memoria:** El hook gestiona el estado local o derivado y devuelve el `selectedValue`. | - 100% agnóstico al diseño (cumple el requerimiento principal a la perfección).<br>- Reutilización máxima.<br>- Facilita el Unit Testing aislando la lógica de eventos y estado del DOM. | - Delega la responsabilidad de aplicar las props (`getProps`) correctamente al desarrollador; si se omite una, se rompe a11y o la navegación.<br>- Curva de aprendizaje mayor para el consumidor de la API. | **Bajo (Excelente)**. No hay Context API. Solo re-renderiza el componente consumidor cuando cambia el estado interno del hook. | **Muy Alta**. La lógica sirve para cualquier representación visual o variante futura sin tocar el hook. | **Alta**. Construir el patrón de "prop getters" y gestionar los `refs` internamente en el hook para el manejo del teclado y focus traps es técnicamente complejo. |
| **3. Render Props** | **Composición:** Cumple el spec literalmente ("slots/render-props"). Ej: `<Dropdown renderTrigger={...} renderItem={...} />`.<br>**A11y/Teclado:** El componente principal maneja los eventos, pero debe pasar los `refs` e inyectar `aria-expanded`/`aria-selected` a través de los argumentos de la función de render. | - Inyección de estado muy explícita (el desarrollador sabe exactamente qué estado tiene el trigger o el item).<br>- Menos abstracción mágica que el Context. | - Difícil de leer ("Callback hell" en JSX).<br>- Pasar `refs` a través de funciones de render para gestionar el foco (teclado) es frágil y propenso a errores en la implementación del consumidor. | **Medio-Alto**. El uso de funciones inline en el render (`renderItem={() => ...}`) genera nuevas referencias en cada ciclo, provocando re-renders si no se optimiza con `useCallback`. | **Baja-Media**. Agregar más zonas dinámicas (header, footer, grupos) vuelve la API de props inmanejable. | **Media**. La lógica interna es más sencilla que Headless, pero la gestión de `refs` a través de las render props requiere cuidado (uso de `forwardRef`). |

---
**Fecha:** 2026-03-16
**Hora:** 23:18:09 CST
**Autor:** Gemini
**Prompt:** me ire con la propuesta 2  Headless (Custom Hooks) quiero que me generes un plan de implementacion paso a paso para pasarselo a mi agente de programacion, usa Spec drive development.

**Output:**

Aquí tienes el plan de implementación basado en Spec-Driven Development. Pásale esto a tu agente para que comience con los contratos y pruebas antes de escribir la lógica.

### Fase 1: Definición de Especificaciones (Specs) y Contratos
El agente debe iniciar definiendo las interfaces exactas (TypeScript) sin implementar la lógica.

**Paso 1.1: Definir la interfaz de entrada (`UseDropdownProps`)**
* `items`: Array de elementos genéricos.
* `initialSelected`: Elemento seleccionado por defecto.
* `onSelect`: Callback bidireccional que se emite al cambiar la selección.
* `id`: Identificador base para accesibilidad (a11y).

**Paso 1.2: Definir la interfaz de salida (`UseDropdownReturn`)**
* `isOpen`: Booleano del estado actual.
* `selectedItem`: El elemento seleccionado.
* `highlightedIndex`: Índice del elemento enfocado por teclado.
* `getToggleButtonProps()`: Función que retorna atributos (`aria-expanded`, `aria-haspopup`, `onClick`, `onKeyDown`, `ref`).
* `getMenuProps()`: Función que retorna atributos para el contenedor de la lista (`role="listbox"`, `id`, `ref`).
* `getItemProps(item, index)`: Función que retorna atributos por cada fila (`role="option"`, `aria-selected`, `onClick`, `onMouseMove`, `ref`).

### Fase 2: Creación de Tests (Spec-Driven)
Antes del código funcional, el agente debe escribir las pruebas unitarias usando `testing-library/react-hooks` que validen el documento `spec.md`.

**Paso 2.1: Specs de Estado Base**
* El hook debe inicializar cerrado.
* Debe retornar el `initialSelected` correcto.

**Paso 2.2: Specs de Interacción del Trigger**
* Hacer click en el trigger alterna `isOpen`.
* El trigger debe recibir los `aria-attributes` correctos según el estado.

**Paso 2.3: Specs de Selección y Sincronización**
* Al seleccionar un item, `selectedItem` se actualiza.
* Al seleccionar un item, `isOpen` pasa a falso.
* Al seleccionar un item, se llama a la función `onSelect` (sincronización bidireccional).

**Paso 2.4: Specs de Teclado y Accesibilidad**
* Presionar flecha abajo/arriba actualiza el `highlightedIndex`.
* Presionar `Enter` en un item resaltado dispara la selección y cierra el menú.
* Presionar `Escape` cierra el menú.

**Paso 2.5: Specs de Click-Outside**
* Un click fuera de los `refs` del trigger o del menú pasa `isOpen` a falso.

### Fase 3: Implementación del Esqueleto (Stubbing)
El agente debe crear la estructura del hook `useDropdown` retornando valores estáticos o funciones vacías que cumplan con la firma de TypeScript de la Fase 1. Todos los tests de la Fase 2 fallarán en este punto.

### Fase 4: Implementación de la Lógica Interna
El agente debe ir haciendo pasar los tests uno a uno implementando:

**Paso 4.1: Estado Local**
* Implementar `useState` o `useReducer` para `isOpen`, `selectedItem`, y `highlightedIndex`.

**Paso 4.2: Prop Getters (Inyección de eventos)**
* Escribir las funciones `getToggleButtonProps`, `getMenuProps` y `getItemProps`.
* Asegurar que las funciones combinen los `onClick` y `onKeyDown` internos del hook con los que el usuario final pueda pasarle como argumento.

**Paso 4.3: Manejo de Teclado y Foco**
* Implementar la lógica dentro de los `onKeyDown` inyectados para capturar las flechas, Enter y Escape.
* Asegurar que el scroll visual siga al `highlightedIndex` usando `refs`.

**Paso 4.4: Efecto Click-Outside**
* Implementar un `useEffect` que escuche el evento `mousedown` en el `document`.
* Validar si el `event.target` está contenido en las referencias del trigger o del menú. Si no lo está, cerrar.

### Fase 5: Revisión de Performance
* El agente debe asegurar que las funciones retornadas por los prop getters estén envueltas en `useCallback` o que el estado interno no dispare re-renders innecesarios en el componente padre.

---
**Fecha:** 2026-03-16
**Hora:** 23:36:09 CST
**Autor:** GPT-5.4 by CODEX
**Prompt:** me ire con la propuesta 2  Headless (Custom Hooks) quiero que me generes un plan de implementacion paso a paso para pasarselo a mi agente de programacion, usa Spec drive development.

Quiero que uses como fuente de la verdad spec.md y me refines este plan, el resultado lo puedes guardar en un file.md llamado plan-refinado.md

### Fase 1: Definición de Especificaciones (Specs) y Contratos
El agente debe iniciar definiendo las interfaces exactas (TypeScript) sin implementar la lógica.

**Paso 1.1: Definir la interfaz de entrada (`UseDropdownProps`)**
* `items`: Array de elementos genéricos.
* `initialSelected`: Elemento seleccionado por defecto.
* `onSelect`: Callback bidireccional que se emite al cambiar la selección.
* `id`: Identificador base para accesibilidad (a11y).

**Paso 1.2: Definir la interfaz de salida (`UseDropdownReturn`)**
* `isOpen`: Booleano del estado actual.
* `selectedItem`: El elemento seleccionado.
* `highlightedIndex`: Índice del elemento enfocado por teclado.
* `getToggleButtonProps()`: Función que retorna atributos (`aria-expanded`, `aria-haspopup`, `onClick`, `onKeyDown`, `ref`).
* `getMenuProps()`: Función que retorna atributos para el contenedor de la lista (`role="listbox"`, `id`, `ref`).
* `getItemProps(item, index)`: Función que retorna atributos por cada fila (`role="option"`, `aria-selected`, `onClick`, `onMouseMove`, `ref`).

### Fase 2: Creación de Tests (Spec-Driven)
Antes del código funcional, el agente debe escribir las pruebas unitarias usando `testing-library/react-hooks` que validen el documento `spec.md`.

**Paso 2.1: Specs de Estado Base**
* El hook debe inicializar cerrado.
* Debe retornar el `initialSelected` correcto.

**Paso 2.2: Specs de Interacción del Trigger**
* Hacer click en el trigger alterna `isOpen`.
* El trigger debe recibir los `aria-attributes` correctos según el estado.

**Paso 2.3: Specs de Selección y Sincronización**
* Al seleccionar un item, `selectedItem` se actualiza.
* Al seleccionar un item, `isOpen` pasa a falso.
* Al seleccionar un item, se llama a la función `onSelect` (sincronización bidireccional).

**Paso 2.4: Specs de Teclado y Accesibilidad**
* Presionar flecha abajo/arriba actualiza el `highlightedIndex`.
* Presionar `Enter` en un item resaltado dispara la selección y cierra el menú.
* Presionar `Escape` cierra el menú.

**Paso 2.5: Specs de Click-Outside**
* Un click fuera de los `refs` del trigger o del menú pasa `isOpen` a falso.

### Fase 3: Implementación del Esqueleto (Stubbing)
El agente debe crear la estructura del hook `useDropdown` retornando valores estáticos o funciones vacías que cumplan con la firma de TypeScript de la Fase 1. Todos los tests de la Fase 2 fallarán en este punto.

### Fase 4: Implementación de la Lógica Interna
El agente debe ir haciendo pasar los tests uno a uno implementando:

**Paso 4.1: Estado Local**
* Implementar `useState` o `useReducer` para `isOpen`, `selectedItem`, y `highlightedIndex`.

**Paso 4.2: Prop Getters (Inyección de eventos)**
* Escribir las funciones `getToggleButtonProps`, `getMenuProps` y `getItemProps`.
* Asegurar que las funciones combinen los `onClick` y `onKeyDown` internos del hook con los que el usuario final pueda pasarle como argumento.

**Paso 4.3: Manejo de Teclado y Foco**
* Implementar la lógica dentro de los `onKeyDown` inyectados para capturar las flechas, Enter y Escape.
* Asegurar que el scroll visual siga al `highlightedIndex` usando `refs`.

**Paso 4.4: Efecto Click-Outside**
* Implementar un `useEffect` que escuche el evento `mousedown` en el `document`.
* Validar si el `event.target` está contenido en las referencias del trigger o del menú. Si no lo está, cerrar.

### Fase 5: Revisión de Performance
* El agente debe asegurar que las funciones retornadas por los prop getters estén envueltas en `useCallback` o que el estado interno no dispare re-renders innecesarios en el componente padre.

Quiero que agregues pruebas unitarias con reactjs, un storybook al plan.

**Output:**
guardado en ./plan-refinado.md

---
**Fecha:** 2026-03-16
**Hora:** 23:50:09 CST
**Autor:** GPT-5.4 by CODEX
**Prompt:** actualizame plan-refinado.md en el apartado de estilos quiere tener el estilo de dropdown que te da tailwind, para eso tengo que instalar y configurar tailwindcss

**Output:**
guardado en ./plan-refinado.md

---
**Fecha:** 2026-03-17
**Hora:** 00:00:01 CST
**Autor:** GPT-5.4 by CODEX
**Prompt:** ejecuta plan-refinado.md y ve creando una lista dentro de ese archivo tachando lo que se va ejecutando.
**Output:**
guardado en ./plan-refinado.md

---

**Fecha:** 2026-03-17
**Hora:** 19:17:04 CST
**Autor:** GPT-5.4 by CODEX
**Prompt:** quiero generar un componente dropdown base usando [useDropdown.ts](kata1-dropdown/src/hooks/useDropdown.ts), el componente base sera un atomo dentro de mi design system asi que la data que pueda manejar lo definira el padre o wrapper que contenga asi como el estilo sin embargo estilo default, primary y secundary, has que el agregar estilos sea escalable por medio de un promp llamado color ademas de tener variante con estilo solido, border, light acorde a lo que tenemos en tailwind.
**Output:**
# Plan: Atomo `Dropdown` del Design System con `color` + `variant` Escalable

## Resumen
Crear un componente base `Dropdown` construido sobre `useDropdown.ts`, agnostico a datos y con estilo controlable desde props del design system. El padre/wrapper definira `items`, seleccion y render de item, mientras el atomo aportara comportamiento, accesibilidad y un sistema de estilos escalable con `color` (token semantico) y `variant` (`solid`, `border`, `light`).  
Se adoptan nombres de estilo: `default`, `primary`, `secondary`.

## Cambios de implementacion
- Introducir un nuevo atomo `Dropdown` (separado del demo actual) con API generica:
  - `items: T[]`
  - `initialSelected?: T | null`
  - `onSelect?: (item: T) => void`
  - `id: string`
  - `getItemLabel: (item: T) => string`
  - `renderItem?: (ctx) => ReactNode`
  - `style?: 'default' | 'primary' | 'secondary'`
  - `variant?: 'solid' | 'border' | 'light'`
  - `color?: DropdownColorToken` (tokens semanticos del DS)
  - `classNames?` opcional por slot (`root`, `trigger`, `menu`, `item`) para overrides no destructivos.
- Mantener `useDropdown` como capa de logica; el atomo solo consume sus prop getters y expone UI base.
- Definir un mapa de tokens semanticos (`color`) desacoplado de Tailwind raw:
  - Matriz `style x variant x color` para clases del trigger/menu/item.
  - Fallback seguro: si no se pasa `color`, usar token por defecto del `style`.
- Soportar composicion visual del padre:
  - `getItemLabel` obligatorio para accesibilidad y texto base.
  - `renderItem` opcional para custom layout del item sin romper seleccion/highlight.
- Migrar/ajustar el demo para usar el nuevo atomo, dejando `DropdownDemo` como wrapper de ejemplo de negocio.
- Actualizar historias para documentar:
  - combinaciones `style` (`default`, `primary`, `secondary`)
  - combinaciones `variant` (`solid`, `border`, `light`)
  - ejemplos de `color` semantico
  - caso con `renderItem` custom.
- Mantener archivos legacy de storybook demo fuera de la ruta principal del atomo (sin eliminarlos si no estorban) para evitar ruido en lint/tsc.

## Cambios de API publica
- Nuevo componente exportado: `Dropdown<T>`.
- Nuevos tipos publicos del DS:
  - `DropdownStyle = 'default' | 'primary' | 'secondary'`
  - `DropdownVariant = 'solid' | 'border' | 'light'`
  - `DropdownColorToken` (union de tokens semanticos definidos por el DS)
  - `DropdownClassNames` para overrides por slot.
- Contrato de render:
  - `renderItem(ctx)` recibe al menos: `item`, `index`, `isSelected`, `isHighlighted`.
  - El atomo sigue aplicando `getItemProps` para conservar comportamiento y a11y.

## Plan de pruebas
- Hook contract (regresion): conservar los tests actuales de `useDropdown`.
- Atomo `Dropdown`:
  - render base con `items + getItemLabel`.
  - seleccion actualiza trigger, cierra menu y dispara `onSelect`.
  - teclado (`ArrowUp/Down`, `Enter`, `Escape`) y click-outside.
  - atributos a11y (`aria-expanded`, `role=listbox`, `role=option`, `aria-selected`).
- Sistema de estilos:
  - snapshot/asserciones de clases para combinaciones representativas de `style`, `variant`, `color`.
  - fallback de token por defecto cuando `color` no se define.
- Storybook:
  - stories para matriz de estilos y variante custom `renderItem`.
  - docs con tabla de props y guia de extension de tokens.

## Suposiciones y defaults
- `secondary` reemplaza definitivamente el typo `secundary`.
- `color` sera token semantico, no clases Tailwind directas.
- `renderItem` sera opcional; el camino base sigue siendo simple con `getItemLabel`.
- `useDropdown.ts` no cambiara su contrato publico salvo ajustes menores de tipos si son estrictamente necesarios para el nuevo atomo.

---

**Fecha:** 2026-03-17
**Hora:** 20:04:01 CST
**Autor:** GPT-5.4 by CODEX
**Prompt:** PLEASE IMPLEMENT THIS PLAN: Plan: Atomo `Dropdown` del Design System con `color` + `variant` Escalable

**Output:**
- Implementado el atomo generico `Dropdown<T>` sobre `useDropdown.ts` con API publica para design system:
  - `style`: `default | primary | secondary`
  - `variant`: `solid | border | light`
  - `color`: token semantico
  - `renderItem` opcional y `classNames` por slot
- Agregado sistema de tema semantico desacoplado:
  - `src/components/dropdown.theme.ts`
  - `src/components/dropdown.types.ts`
  - `src/components/index.ts` (exports publicos)
- Migrado `DropdownDemo` para consumir el atomo en lugar de usar `useDropdown` directo.
- Agregadas historias nuevas de Storybook:
  - `Design System/Dropdown` con playground, matriz de estilos y `renderItem` custom.
  - Ajuste de stories existentes para usar el nuevo atomo.
- Agregadas pruebas unitarias del atomo:
  - contrato base (`items + getItemLabel`)
  - seleccion + `onSelect` + cierre
  - teclado + `Escape` + click-outside + a11y
  - fallback de color por `style` y override por token
  - `renderItem` custom sin perder estado seleccionado
- Ajuste de lint para ignorar `storybook-static` generado.

**Validacion ejecutada:**
- `npm.cmd run lint` -> OK
- `npx.cmd tsc -b` -> OK

---

**Fecha:** 2026-03-17
**Hora:** 20:51:21 CST
**Autor:** GPT-5.4 by CODEX
**Prompt:** en App.tsx agregame otra seccion donde el dropdown renderice como item un componente, eres libre de armar la lista de data de ejemplo, recuerda actualiza rel log con los cambios

**Output:**
- Actualizado `src/App.tsx` agregando una nueva seccion en el bento layout llamada `Custom Item Component`.
- Se creo un ejemplo de data `teamOptions` (entrenadores) con metadata visual:
  - `label`, `role`, `zone`, `score`, `accent`.
- Se agrego un `Dropdown` nuevo (`id: trainer-assignment`) que usa `renderItem` para dibujar cada option como componente compuesto:
  - avatar circular con color dinamico
  - nombre + rol + ciudad
  - estado visual lateral (`picked`, `hover` o score)
- Se agrego estado local `assignedTrainer` y panel de resumen debajo del dropdown para mostrar la seleccion actual.
- Se mantuvo la compatibilidad responsive dentro de la grilla tipo bento.

**Validacion ejecutada:**
- `npm.cmd run lint` -> OK
- `npx.cmd tsc -b` -> OK
- `npm.cmd test` -> OK (12 tests)
- `npm.cmd run build` -> OK
- `npm.cmd run build-storybook` -> OK

---

**Fecha:** 2026-03-17
**Hora:** 20:38:07 CST
**Autor:** GPT-5.4 by CODEX
**Prompt:** ahora quiero que me generes dentro de App.tsx los siguentes ejemplos: un formulario de pokemons nombre, ataque, tipo de pokemon(dropdown) y generacion (dropdown), otro ejemplo donde esten las variantes de dropdown y abajo donde este Dropdown demo haciendo incapie que la logica esta en un hook, con una grid layout tipo bento , compatible con responsible design, al terminar actualizame el log.md con lo que realizaste

**Output:**
- Actualizado `src/App.tsx` con una nueva experiencia tipo bento grid responsive (mobile-first y columnas en desktop):
  - Header introductorio del playground.
  - Bloque 1: formulario Pokemon con:
    - `Pokemon Name` (input)
    - `Attack` (input)
    - `Pokemon Type` (Dropdown atomico)
    - `Generation` (Dropdown atomico)
  - Bloque 2: panel `Current Payload` para visualizar el estado actual del formulario.
  - Bloque 3: showcase de variantes del atomo Dropdown:
    - `default + border`
    - `primary + solid`
    - `secondary + light`
  - Bloque 4: seccion `Dropdown Demo: hook-driven logic` con mensaje explicito de que la logica vive en `useDropdown`.
- Se mantuvo el enfoque de design system:
  - Data/control en el componente padre (`App.tsx`).
  - Logica encapsulada en hook y expuesta por el atomo `Dropdown`.
  - Estilo configurable por `style`, `variant`, `color`.

**Validacion ejecutada:**
- `npm.cmd run lint` -> OK
- `npx.cmd tsc -b` -> OK


