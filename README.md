# 🛒 Shop Listing

Aplicación móvil-first para gestionar listas de compras del supermercado. Permite agregar productos, marcarlos como comprados, guardar el historial de compras y mucho más.

---

## 🚀 Demo

> [Deploy](https://shop-listing.vercel.app/)

---

## 🧠 Descripción

Aplicación de lista de compras pensada para usarse desde el celular mientras hacés las compras. Permite:

- Crear y gestionar una lista de productos en tiempo real
- Marcar productos como comprados con auto-reorden automático
- Editar el nombre de cualquier producto directamente en la lista
- Guardar el historial de compras con título y monto
- Cargar ítems de listas anteriores evitando duplicados
- Deshacer y rehacer cualquier cambio
- Exportar e importar listas en JSON
- Cambiar entre modo oscuro y claro

---

## 🛠️ Tecnologías

| Capa | Tecnología |
| ------ | ----------- |
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Estilos | Tailwind CSS 3 |
| Animaciones | Framer Motion |
| Notificaciones | Sonner |
| Iconos | Lucide React |
| Drag & Drop | @dnd-kit (core, sortable) |
| Fechas | Day.js |
| IDs | uuid |
| Utils | clsx + tailwind-merge |

---

## 📁 Estructura del proyecto

```
shopListing/
├── src/
│   ├── components/
│   │   ├── DraggableListItem.tsx   # Ítem individual con drag & drop y edición inline
│   │   ├── ShoppingList.tsx        # Contenedor de la lista con contexto DnD
│   │   ├── QuickInput.tsx          # Barra de entrada fija en la parte inferior
│   │   ├── TrashZone.tsx           # Zona de drop para eliminar ítems
│   │   ├── HistoryDrawer.tsx       # Panel lateral con historial, búsqueda y ordenamiento
│   │   └── SaveListModal.tsx       # Modal para guardar la lista con título y monto
│   ├── hooks/
│   │   ├── useShoppingList.ts      # Hook principal — orquesta toda la lógica
│   │   ├── useStorage.ts           # Hook genérico para persistir en localStorage
│   │   └── useUndoRedo.ts          # Hook para deshacer/rehacer (stack de 50 pasos)
│   ├── lib/
│   │   └── utils.ts                # Función cn() para combinar clases Tailwind
│   ├── types/
│   │   └── index.ts                # Interfaces TypeScript: ShoppingItem, SavedList, SortOrder
│   ├── App.tsx                     # Componente raíz: layout, tema y atajos de teclado
│   ├── main.tsx                    # Punto de entrada de React (ReactDOM.createRoot)
│   └── index.css                   # Tailwind base layers + utilidades de scrollbar
├── tailwind.config.js              # Configuración de Tailwind (dark mode, colores)
├── postcss.config.js               # PostCSS necesario para procesar Tailwind
├── package.json
└── README.md
```

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/FranQuarnolo/shopListing.git
```

2. Entrar en el proyecto:

```bash
cd shopListing
```

3. Instalar dependencias:

```bash
npm install
```

4. Ejecutar el proyecto:

```bash
npm run dev
```

---

## 🧩 Funcionalidades

- ✅ Agregar productos desde el input flotante en la parte inferior
- ✅ Marcar como comprado — los comprados se mueven al final automáticamente
- ✅ Edición inline del nombre haciendo click sobre él (Enter confirma, Escape cancela)
- ✅ Drag & drop para reordenar ítems o arrastrarlos a la papelera para eliminarlos
- ✅ Guardar lista al historial con título y monto total
- ✅ Historial con búsqueda por nombre, ordenamiento y vista expandible por lista
- ✅ Cargar ítems de una lista guardada a la lista activa (sin duplicados)
- ✅ Deshacer/Rehacer hasta 50 pasos (Ctrl+Z / Ctrl+Y + botones en el header)
- ✅ Exportar todas las listas como archivo JSON
- ✅ Importar listas desde un archivo JSON exportado previamente
- ✅ Dark mode / Light mode con persistencia entre sesiones
- ✅ Diseño Mobile First — optimizado para celular, funciona bien en PC también

---

## 💾 Almacenamiento de datos

La aplicación **no usa ninguna base de datos ni backend**. Todos los datos se guardan localmente en el navegador usando **`localStorage`**.

### ¿Qué es localStorage?

Es una API nativa del navegador que permite guardar pares clave → valor como strings. Los datos **persisten aunque cierres el navegador**, pero están ligados al dispositivo y al navegador donde se usa la app.

### Claves utilizadas

| Clave | Contenido |
| ------- | --------- |
| `shopListing_current` | Lista activa actual (array de ítems) |
| `shopListing_history` | Historial de listas guardadas (array de listas) |
| `shopListing_theme` | Preferencia de tema: `"dark"` o `"light"` |

### ¿Cómo funciona en el código?

```text
useShoppingList()
  ├── useUndoRedo → gestiona la lista activa en memoria + historial de cambios
  │     └── guarda en localStorage cada vez que la lista cambia (useEffect)
  └── useStorage  → gestiona el historial de listas guardadas
        └── lee de localStorage al iniciar, guarda automáticamente al cambiar
```

El hook `useStorage` es genérico: recibe una clave y un valor por defecto, y devuelve `[valor, setValor]` exactamente como `useState`, pero con persistencia automática.

> **Limitación:** si el usuario borra el caché o usa otro navegador/dispositivo, los datos no estarán disponibles. Para sincronización real se necesitaría un backend.

---

## ⌨️ Atajos de teclado

| Atajo | Acción |
| ------- | -------- |
| `Ctrl + Z` | Deshacer |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Rehacer |
| `Enter` en el input | Agregar producto |
| `Enter` editando nombre | Confirmar edición |
| `Escape` editando | Cancelar edición |

---

## 📊 Antes y después — Historial de mejoras

### Styling y dependencias

| Aspecto | Antes | Después |
| --------- | ------- | --------- |
| Estilos | Ant Design + inline styles masivos | Tailwind CSS — clases utilitarias, sin CSS inline |
| Componentes UI | Ant Design (antd 5.x) — pesado, opinionado | Componentes propios con Tailwind — livianos y customizables |
| Iconos | @ant-design/icons | Lucide React — tree-shakeable, consistente |
| Notificaciones | SweetAlert2 — modales bloqueantes y pesados | Sonner — toasts no intrusivos, livianos |
| Animaciones | Sin animaciones | Framer Motion — entrada/salida/layout/check animados |
| Bundle CSS | ~500 KB (Ant Design completo) | ~21 KB (Tailwind purgeado) |

### Funcionalidades

| Feature | Antes | Después |
| --------- | ------- | --------- |
| Edición inline de nombre | ⚠️ Existía pero sin UX clara | ✅ Click sobre el nombre, Enter/Escape para confirmar |
| Undo / Redo | ❌ No existía | ✅ 50 pasos de historial, Ctrl+Z/Y + botones en header |
| Exportar / Importar | ❌ No existía | ✅ Descarga y carga JSON con lista actual e historial |
| Búsqueda en historial | ❌ No existía | ✅ Búsqueda por nombre en tiempo real |
| Ordenar historial | ❌ Solo por fecha de guardado | ✅ Por fecha, nombre A-Z o mayor monto |
| Confirmación al borrar | SweetAlert2 modal bloqueante | Inline confirm dentro del propio panel |
| Nueva lista | SweetAlert2 modal bloqueante | Toast inmediato, sin fricción |
| Dark mode | Ant Design ConfigProvider theme | Tailwind `dark:` class en `<html>` |

### Arquitectura

| Aspecto | Antes | Después |
| --------- | ------- | --------- |
| Lógica de estado | 1 hook con todo mezclado (CRUD + UI + storage) | Separado en `useShoppingList` + `useStorage` + `useUndoRedo` |
| Confirmaciones | `Swal.fire` dentro del hook (lógica UI en capa de datos) | Toasts en el hook, confirmaciones inline en componentes |
| Persistencia | `useState` + `useEffect` duplicado en cada lugar | `useStorage` genérico y reutilizable |
| Comentarios | Sin documentación interna | Comentarios en español explicando cada decisión |

---

## 👨‍💻 Autor

Fran Quarnolo
https://github.com/FranQuarnolo
