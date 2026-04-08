// ============================================================
// App.tsx — Componente raíz de la aplicación
//
// Es el punto de entrada de React. Aquí se:
//   1. Conecta el hook principal con todos los componentes
//   2. Gestiona el estado global del tema (dark/light)
//   3. Registra los atajos de teclado globales (Ctrl+Z / Ctrl+Y)
//   4. Renderiza el layout completo (header + main + modales)
// ============================================================

import { useState, useEffect } from "react";
import { Toaster } from "sonner"; // Contenedor de notificaciones toast
import { Menu, Save, Undo2, Redo2 } from "lucide-react";
import { useShoppingList } from "./hooks/useShoppingList";
import { ShoppingList } from "./components/ShoppingList";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { SaveListModal } from "./components/SaveListModal";
import { cn } from "./lib/utils";

function App() {
  // Obtenemos toda la lógica de la lista del custom hook
  // Los componentes no saben cómo funciona el estado, solo usan lo que el hook expone
  const {
    currentList,
    history,
    addItem,
    toggleItem,
    removeItem,
    editItem,
    reorderItems,
    saveList,
    startNewList,
    deleteList,
    duplicateList,
    exportLists,
    importLists,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useShoppingList();

  // Estado local del componente (no necesita estar en el hook porque es solo UI)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // El tema se inicializa leyendo localStorage — función de inicialización lazy de useState
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("shopListing_theme");
    return saved ? saved === "dark" : true; // Por defecto: modo oscuro
  });

  // Cada vez que cambia el tema, actualizamos la clase del elemento <html>
  // Tailwind usa la clase "dark" en el root para activar los estilos dark:*
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("shopListing_theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Registro de atajos de teclado globales
  // El cleanup (return) elimina el listener cuando el componente se desmonta
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler); // Cleanup
  }, [undo, redo]);

  return (
    // Contenedor raíz: ocupa toda la pantalla y define el gradiente de fondo
    <div
      className={cn(
        "flex flex-col h-full",
        isDark
          ? "bg-gradient-to-br from-slate-900 to-indigo-950"
          : "bg-gradient-to-br from-slate-100 to-indigo-100",
      )}
    >
      {/*
        Toaster renderiza las notificaciones toast en la pantalla.
        Se pone aquí para que esté disponible en toda la app.
        richColors activa los colores semánticos (verde=éxito, rojo=error, etc.)
      */}
      {/* bottom-center: no interfiere con el header, y en mobile queda cerca del pulgar.
          offset sube los toasts por encima del QuickInput fijo (~72px de alto) */}
      <Toaster
        position="bottom-center"
        richColors
        offset="88px"
        toastOptions={{ duration: 2000 }}
      />

      {/* ── Header ── */}
      {/* sticky top-0 hace que el header quede fijo al hacer scroll */}
      <header
        className={cn(
          "flex items-center justify-between px-4 h-14 shrink-0",
          "sticky top-0 z-10 backdrop-blur-md",
          isDark
            ? "bg-black/40 border-b border-white/10"
            : "bg-white/60 border-b border-black/10",
        )}
      >
        {/* Botón de menú: abre el drawer del historial */}
        <button
          type="button"
          title="Historial"
          onClick={() => setDrawerOpen(true)}
          className={cn(
            "p-2 rounded-xl transition-colors",
            isDark
              ? "text-white hover:bg-white/10"
              : "text-slate-800 hover:bg-black/10",
          )}
        >
          <Menu size={22} />
        </button>

        <h1
          className={cn(
            "text-lg font-semibold tracking-tight",
            isDark ? "text-white" : "text-slate-900",
          )}
        >
          Lista del Super
        </h1>

        {/* Grupo de botones de acción */}
        <div className="flex items-center gap-1">
          {/* Deshacer — disabled cuando no hay historial */}
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            title="Deshacer (Ctrl+Z)"
            className={cn(
              "p-2 rounded-xl transition-colors",
              isDark
                ? "text-white/80 hover:bg-white/10"
                : "text-slate-700 hover:bg-black/10",
              !canUndo && "opacity-25 cursor-not-allowed",
            )}
          >
            <Undo2 size={18} />
          </button>

          {/* Rehacer — disabled cuando no hay estados futuros */}
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            title="Rehacer (Ctrl+Y)"
            className={cn(
              "p-2 rounded-xl transition-colors",
              isDark
                ? "text-white/80 hover:bg-white/10"
                : "text-slate-700 hover:bg-black/10",
              !canRedo && "opacity-25 cursor-not-allowed",
            )}
          >
            <Redo2 size={18} />
          </button>

          {/* Guardar lista — disabled cuando la lista está vacía */}
          <button
            type="button"
            onClick={() => setSaveModalOpen(true)}
            disabled={currentList.length === 0}
            title="Guardar lista"
            className={cn(
              "p-2 rounded-xl transition-colors text-indigo-400",
              currentList.length > 0
                ? "hover:bg-indigo-400/20"
                : "opacity-25 cursor-not-allowed",
            )}
          >
            <Save size={22} />
          </button>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      {/* flex-1 + overflow-y-auto: ocupa el espacio restante y permite scroll */}
      <main className="flex-1 overflow-y-auto">
        {/* max-w-2xl centra el contenido en pantallas grandes */}
        <div className="max-w-2xl mx-auto w-full">
          <ShoppingList
            items={currentList}
            isDark={isDark}
            onToggle={toggleItem}
            onRemove={removeItem}
            onEdit={editItem}
            onReorder={reorderItems}
            onAdd={addItem}
          />
        </div>
      </main>

      {/* ── Drawer lateral del historial ── */}
      <HistoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        history={history}
        isDark={isDark}
        onNewList={() => {
          startNewList();
          setDrawerOpen(false);
        }}
        onDeleteList={deleteList}
        onDuplicateList={(list) => {
          duplicateList(list);
          setDrawerOpen(false);
        }}
        onToggleTheme={() => setIsDark((d) => !d)}
        onExport={exportLists}
        onImport={importLists}
      />

      {/* ── Modal para guardar la lista ── */}
      <SaveListModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={saveList}
        isDark={isDark}
      />
    </div>
  );
}

export default App;
