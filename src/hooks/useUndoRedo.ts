// ============================================================
// useUndoRedo — Hook para deshacer/rehacer cambios de estado
//
// Implementa el patrón "Command History" con tres arrays:
//
//   past    → estados anteriores (hasta 50 guardados)
//   present → estado actual
//   future  → estados que fueron deshechos (disponibles para rehacer)
//
// Analogía: es como la barra de deshacer de un editor de texto.
//
//   [A, B, C] present=D → undo → [A, B] present=C future=[D]
//                        → redo → [A, B, C] present=D future=[]
// ============================================================

import { useState, useCallback } from 'react';

/**
 * @param initial - Valor inicial del estado
 * @returns objeto con: state, set, undo, redo, canUndo, canRedo
 */
export function useUndoRedo<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  /**
   * Reemplaza el estado actual y guarda el anterior en el historial.
   * Acepta un valor directo O una función (igual que React setState).
   * useCallback evita recrear la función en cada render.
   */
  const set = useCallback((newPresent: T | ((prev: T) => T)) => {
    setPresent((prev) => {
      const next = typeof newPresent === 'function'
        ? (newPresent as (p: T) => T)(prev) // Forma funcional: recibe el estado anterior
        : newPresent;                         // Forma directa: valor nuevo

      // Guardamos el estado anterior en "past" (máximo 50 para no acumular memoria)
      setPast((p) => [...p.slice(-50), prev]);
      setFuture([]); // Al hacer un cambio nuevo, se borra el "futuro"
      return next;
    });
  }, []);

  /** Deshace el último cambio: mueve "present" a future y restaura el último past */
  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p; // No hay nada que deshacer
      const previous = p[p.length - 1];
      const newPast = p.slice(0, -1);
      setFuture((f) => [present, ...f]); // El estado actual va al future
      setPresent(previous);              // Restauramos el estado anterior
      return newPast;
    });
  }, [present]);

  /** Rehace el cambio más reciente deshecho */
  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f; // No hay nada que rehacer
      const next = f[0];
      const newFuture = f.slice(1);
      setPast((p) => [...p, present]); // El estado actual vuelve al past
      setPresent(next);
      return newFuture;
    });
  }, [present]);

  return {
    state: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,   // true si hay estados para deshacer
    canRedo: future.length > 0, // true si hay estados para rehacer
  };
}
