// ============================================================
// SaveListModal — Modal para guardar la lista actual en el historial
//
// Este modal aparece sobre la pantalla con un fondo oscurecido (backdrop).
// Usa Framer Motion para la animación de entrada/salida.
//
// El usuario puede:
//   - Editar el título de la compra
//   - Ingresar el monto total gastado manualmente
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '../lib/utils';

interface SaveListModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, total: number) => void;
  isDark: boolean;
}

export const SaveListModal: React.FC<SaveListModalProps> = ({
  open,
  onClose,
  onSave,
  isDark,
}) => {
  const [title, setTitle] = useState('');
  const [total, setTotal] = useState('');

  // Cada vez que el modal se abre, inicializamos los campos con valores por defecto
  // La dependencia [open] hace que este efecto se ejecute solo cuando cambia "open"
  useEffect(() => {
    if (open) {
      // Título por defecto: "Compra 08/04"
      setTitle(`Compra ${dayjs().format('DD/MM')}`);
      setTotal('');
    }
  }, [open]);

  /** Valida, llama al callback con los datos y cierra el modal */
  const handleSave = () => {
    if (!title.trim()) return;
    const parsedTotal = parseFloat(total);
    // Si el total no es un número válido, guardamos 0
    onSave(title.trim(), isNaN(parsedTotal) ? 0 : parsedTotal);
    onClose();
  };

  // Clases base del contenedor del modal según el tema
  const modalBase = isDark
    ? 'bg-slate-900 text-white border-white/10'
    : 'bg-white text-slate-900 border-slate-200';

  // Clases para los inputs según el tema (fondo oscuro en dark, claro en light)
  const inputClass = isDark
    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500';

  return (
    /*
      AnimatePresence permite que Framer Motion anime la salida del componente.
      Sin esto, React eliminaría el componente instantáneamente sin animación.
    */
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — fondo oscuro semitransparente que cubre toda la pantalla */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Click fuera del modal cierra el modal
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Contenedor del modal — centrado vertical y horizontalmente */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'fixed z-50 left-4 right-4 bottom-1/2 translate-y-1/2 mx-auto max-w-sm',
              'rounded-3xl border shadow-2xl p-6',
              modalBase
            )}
          >
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Guardar Compra</h2>
              <button
                type="button"
                title="Cerrar"
                onClick={onClose}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                )}
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4">

              {/* Campo: Título */}
              <div>
                <label className={cn(
                  'block text-xs font-medium mb-1.5',
                  isDark ? 'text-white/50' : 'text-slate-500'
                )}>
                  Título de la compra
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                  placeholder="Ej: Compra Semanal"
                  title="Título de la compra"
                  autoFocus
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-base outline-none transition-colors',
                    inputClass
                  )}
                />
              </div>

              {/* Campo: Monto total */}
              <div>
                <label className={cn(
                  'block text-xs font-medium mb-1.5',
                  isDark ? 'text-white/50' : 'text-slate-500'
                )}>
                  Monto Total
                </label>
                {/* div relativo para posicionar el símbolo $ de forma absoluta dentro del input */}
                <div className="relative">
                  <span className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 text-base select-none',
                    isDark ? 'text-slate-400' : 'text-slate-400'
                  )}>
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                    placeholder="0.00"
                    title="Monto total"
                    className={cn(
                      'w-full pl-8 pr-4 py-3 rounded-xl border text-base outline-none transition-colors',
                      inputClass
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-colors',
                  isDark
                    ? 'bg-white/10 hover:bg-white/15 text-white/70'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                )}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!title.trim()}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors',
                  title.trim()
                    ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    : 'opacity-40 cursor-not-allowed bg-indigo-500 text-white'
                )}
              >
                <Save size={16} /> Guardar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
