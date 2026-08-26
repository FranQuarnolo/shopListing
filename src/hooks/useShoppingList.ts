// ============================================================
// useShoppingList — Hook principal de la aplicación
//
// Un "custom hook" en React es una función que empieza con "use"
// y puede llamar a otros hooks (useState, useEffect, etc.).
// Sirve para extraer lógica del componente y reutilizarla.
//
// Este hook orquesta los otros dos hooks especializados:
//   - useStorage  → persistencia en localStorage
//   - useUndoRedo → historial de cambios (ctrl+z)
// ============================================================

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';  // Genera IDs únicos del tipo "a3f2-..."
import dayjs from 'dayjs';             // Librería para manejar fechas fácilmente
import { toast } from 'sonner';        // Notificaciones tipo "toast" no bloqueantes
import { ShoppingItem, SavedList } from '../types';
import { useStorage } from './useStorage';
import { useUndoRedo } from './useUndoRedo';
import { formatListForSharing } from '../lib/shareFormat';

export const useShoppingList = () => {
  // Lee la lista desde localStorage una sola vez como valor inicial.
  // Al pasarle una función, useUndoRedo (y useState internamente) la llama
  // solo en el primer render — evita la carrera entre el efecto de guardado
  // y el de carga que borraba la lista al abrir la app.
  const { state: currentList, set: setList, undo, redo, canUndo, canRedo } = useUndoRedo<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopListing_current');
      if (saved) return JSON.parse(saved) as ShoppingItem[];
    } catch {
      // JSON corrupto: arrancamos con lista vacía
    }
    return [];
  });

  // useStorage maneja automáticamente la persistencia del historial
  const [history, setHistory] = useStorage<SavedList[]>('shopListing_history', []);

  // Cada vez que cambia la lista actual, la guardamos en localStorage.
  // Como currentList ya se inicializó con el valor correcto, este efecto
  // siempre escribe datos válidos (nunca [] por error de orden).
  useEffect(() => {
    localStorage.setItem('shopListing_current', JSON.stringify(currentList));
  }, [currentList]);

  // --- CRUD de ítems ---

  /** Agrega un nuevo ítem al final de la lista */
  const addItem = (name: string) => {
    const newItem: ShoppingItem = {
      id: uuidv4(),    // ID único generado en el momento
      name,
      purchased: false,
    };
    // setList recibe una función que toma el estado anterior y devuelve el nuevo
    // Esta es la forma funcional de actualizar estado en React (más segura)
    setList((prev) => [...prev, newItem]);
  };

  /**
   * Marca/desmarca un ítem como comprado.
   * Luego reordena: los no comprados van primero, los comprados al final.
   */
  const toggleItem = (id: string) => {
    setList((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      );
      // Ordenamiento: false (no comprado) < true (comprado)
      return updated.sort((a, b) => {
        if (a.purchased === b.purchased) return 0;
        return a.purchased ? 1 : -1;
      });
    });
  };

  /** Elimina un ítem por su ID */
  const removeItem = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  };

  /** Renombra un ítem existente */
  const editItem = (id: string, newName: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  /**
   * Reordena ítems después de un drag & drop.
   * Recibe el ID del ítem arrastrado y el ID del ítem destino.
   */
  const reorderItems = (activeId: string, overId: string) => {
    setList((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === activeId);
      const newIndex = prev.findIndex((item) => item.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      // Splice: extrae el elemento de su posición original e inserta en la nueva
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  };

  // --- Gestión del historial ---

  /**
   * Guarda la lista actual en el historial con un título y monto.
   * Después de guardar, limpia la lista activa.
   */
  const saveList = (title: string, total: number) => {
    if (currentList.length === 0) return;

    const newList: SavedList = {
      id: uuidv4(),
      title,
      date: dayjs().toISOString(), // Fecha actual en ISO para poder ordenar/formatear después
      total,
      items: [...currentList],     // Copia del array para no guardar la referencia mutable
    };

    // Agrega la nueva lista al principio del historial
    setHistory((prev) => [newList, ...prev]);
    setList([]);
    toast.success('Lista guardada correctamente');
  };

  /** Limpia la lista activa para empezar de nuevo */
  const startNewList = () => {
    if (currentList.length === 0) {
      toast.info('La lista ya está vacía');
      return;
    }
    setList([]);
    toast.success('Lista nueva creada');
  };

  /** Elimina una lista guardada del historial por su ID */
  const deleteList = (id: string) => {
    setHistory((prev) => prev.filter((list) => list.id !== id));
    toast.success('Lista eliminada');
  };

  /**
   * Carga los ítems de una lista guardada a la lista activa.
   * Evita duplicados comparando nombres (case-insensitive).
   */
  const duplicateList = (list: SavedList) => {
    // Set de nombres en minúsculas para comparar sin importar mayúsculas
    const currentNames = new Set(currentList.map((i) => i.name.toLowerCase().trim()));

    const newItems = list.items
      .filter((item) => !currentNames.has(item.name.toLowerCase().trim()))
      .map((item) => ({ ...item, id: uuidv4(), purchased: false }));

    if (newItems.length === 0) {
      toast.info('Todos los ítems ya están en tu lista');
      return;
    }

    setList((prev) => [...prev, ...newItems]);
    toast.success(`Se agregaron ${newItems.length} ítems`);
  };

  // --- Compartir ---

  /**
   * Comparte la lista actual como texto.
   * En celulares con soporte de Web Share API (navigator.share) abre el
   * panel nativo de compartir (WhatsApp, Telegram, SMS, etc.).
   * Si no está disponible (ej: desktop), copia el texto al portapapeles.
   */
  const shareList = async () => {
    if (currentList.length === 0) {
      toast.info('No hay productos para compartir');
      return;
    }

    const message = formatListForSharing(currentList);

    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch (err) {
        // AbortError = el usuario cerró el panel de compartir sin elegir nada, no es un error real
        if ((err as Error).name !== 'AbortError') {
          toast.error('No se pudo compartir la lista');
        }
      }
    } else {
      await navigator.clipboard.writeText(message);
      toast.success('Lista copiada al portapapeles');
    }
  };

  // --- Importar / Exportar ---

  /**
   * Exporta la lista actual y el historial completo como un archivo JSON.
   * Usa la API de Blob y URL.createObjectURL para generar la descarga.
   */
  const exportLists = () => {
    const data = JSON.stringify({ currentList, history }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob); // URL temporal para el blob
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopListing_${dayjs().format('YYYY-MM-DD')}.json`;
    a.click();
    URL.revokeObjectURL(url); // Libera la URL temporal de memoria
    toast.success('Listas exportadas');
  };

  /**
   * Importa listas desde un archivo JSON seleccionado por el usuario.
   * Usa la API FileReader para leer el contenido del archivo.
   */
  const importLists = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.history) setHistory(parsed.history);
        if (parsed.currentList) setList(parsed.currentList);
        toast.success('Listas importadas correctamente');
      } catch {
        toast.error('El archivo no es válido');
      }
    };
    reader.readAsText(file); // Inicia la lectura → dispara onload cuando termina
  };

  // Retornamos todo lo que los componentes necesitan usar
  return {
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
    shareList,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
