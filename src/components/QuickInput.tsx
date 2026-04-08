// ============================================================
// QuickInput — Barra de entrada fija en la parte inferior
//
// Este componente está "fixed" (posición fija en la pantalla)
// para que siempre esté accesible sin necesidad de hacer scroll.
// Es el punto de entrada principal para agregar nuevos productos.
// ============================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuickInputProps {
  onAdd: (name: string) => void;
  isDark: boolean;
}

export const QuickInput: React.FC<QuickInputProps> = ({ onAdd, isDark }) => {
  // Estado local del input — solo necesitamos guardar el texto mientras se escribe
  const [value, setValue] = useState('');

  /** Valida, llama al callback y limpia el input */
  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return; // No agregar ítems vacíos
    onAdd(trimmed);
    setValue(''); // Limpiamos para el próximo producto
  };

  return (
    // fixed + bottom-0 + left-0 + right-0 = pega el div al fondo de la pantalla
    // z-40 asegura que quede por encima del contenido scrolleable
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 pt-2">
      <div className={cn(
        'w-full max-w-2xl rounded-2xl border backdrop-blur-xl shadow-2xl',
        isDark
          ? 'bg-black/60 border-white/10'
          : 'bg-white/90 border-black/10'
      )}>
        <div className="flex items-center gap-2 px-3 py-2">

          {/* Input de texto */}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Agregar producto..."
            title="Nombre del producto"
            autoComplete="off"
            className={cn(
              'flex-1 bg-transparent text-base outline-none placeholder:opacity-40',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          />

          {/* Botón de agregar — se activa solo cuando hay texto */}
          <button
            type="button"
            onClick={handleSubmit}
            title="Agregar"
            disabled={!value.trim()}
            className={cn(
              'shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all',
              value.trim()
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : isDark ? 'bg-white/10 text-white/30' : 'bg-slate-100 text-slate-300'
            )}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
