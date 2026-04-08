// ============================================================
// useStorage — Hook genérico para persistir estado en localStorage
//
// localStorage es una API del navegador que permite guardar datos
// como strings (clave → valor) que sobreviven al refrescar la página.
//
// Este hook combina useState + useEffect para que:
//   1. Al iniciar, lee el valor guardado (si existe)
//   2. Cada vez que cambia el valor, lo guarda automáticamente
//
// Es genérico (<T>) para poder usarse con cualquier tipo de dato.
// ============================================================

import { useState, useEffect } from 'react';

/**
 * @param key   - Nombre de la clave en localStorage (debe ser única por dato)
 * @param initialValue - Valor por defecto si no hay nada guardado
 * @returns     - [valor, setValor] igual que useState
 */
export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      // JSON.parse convierte el string guardado de vuelta al tipo original
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      // Si el JSON está corrupto, usamos el valor por defecto
      return initialValue;
    }
  });

  // Cada vez que "value" cambia, actualizamos localStorage
  useEffect(() => {
    // JSON.stringify convierte el valor (objeto/array) a un string para guardarlo
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
