// ============================================================
// DraggableListItem — Ítem individual de la lista de compras
//
// Combina tres responsabilidades:
//   1. Drag & Drop: con @dnd-kit/sortable para poder arrastrarse
//   2. Edición inline: click sobre el nombre para editarlo en el lugar
//   3. Animación: con Framer Motion para entrada/salida suaves
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable'; // Hook que convierte este div en arrastrable
import { CSS } from '@dnd-kit/utilities';         // Transforma el objeto transform de dnd-kit a string CSS
import { motion } from 'framer-motion';            // Componentes animados
import { ShoppingItem } from '../types';
import { cn } from '../lib/utils';                 // Función helper para combinar clases Tailwind

interface DraggableListItemProps {
  item: ShoppingItem;
  isDark: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

export const DraggableListItem: React.FC<DraggableListItemProps> = ({
  item,
  isDark,
  onToggle,
  onEdit,
}) => {
  // useSortable registra este componente en el contexto de DnD
  // y devuelve los handlers y el estado del arrastre
  const {
    attributes,  // Atributos de accesibilidad (aria-*)
    listeners,   // Eventos del mouse/touch para iniciar el arrastre
    setNodeRef,  // Ref para que dnd-kit sepa qué elemento arrastrar
    transform,   // Posición actual mientras se arrastra
    transition,  // Transición CSS para el movimiento suave
    isDragging,  // true mientras este ítem está siendo arrastrado
  } = useSortable({ id: item.id });

  // Estado local para controlar si el nombre está siendo editado
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null); // Ref para hacer foco automático

  // Cuando entramos al modo edición, ponemos el foco en el input
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  // Al actualizar el nombre del item externamente, sincronizamos el valor del input
  useEffect(() => {
    setEditValue(item.name);
  }, [item.name]);

  /** Confirma la edición y llama al callback del padre */
  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.name) {
      onEdit(item.id, trimmed);
    } else {
      // Si no cambió nada o está vacío, restauramos el valor original
      setEditValue(item.name);
    }
    setIsEditing(false);
  };

  // Estilos dinámicos que dnd-kit necesita para mover el elemento visualmente
  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    // motion.div es un div normal pero con capacidades de animación de Framer Motion
    // layout={true} hace que Framer Motion anime automáticamente los cambios de posición
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}   // Estado inicial al aparecer
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }} // Semitransparente mientras se arrastra
      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }} // Animación al eliminarse
      transition={{ duration: 0.18 }}
      ref={setNodeRef}
      style={dragStyle}
      className={cn(
        'mb-3 rounded-2xl border px-4 py-3',
        'backdrop-blur-md shadow-sm select-none',
        isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-black/10',
      )}
    >
      {/*
        Los {...attributes} y {...listeners} van en el contenedor principal
        para que todo el ítem sea el área de agarre del drag
      */}
      <div className="flex items-center gap-3" {...attributes} {...listeners}>

        {/* Checkbox circular personalizado */}
        <button
          type="button"
          title={item.purchased ? 'Marcar como no comprado' : 'Marcar como comprado'}
          onClick={(e) => {
            e.stopPropagation(); // Evita que el click active el drag
            onToggle(item.id);
          }}
          className={cn(
            'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
            item.purchased
              ? 'bg-indigo-500 border-indigo-500'
              : isDark ? 'border-white/30 hover:border-indigo-400' : 'border-slate-300 hover:border-indigo-400'
          )}
        >
          {/* El SVG del check aparece solo cuando está comprado, con animación de escala */}
          {item.purchased && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              width="12" height="12" viewBox="0 0 12 12" fill="none"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </button>

        {/* Área del nombre: alterna entre texto editable e input */}
        <div
          className="flex-1 min-w-0"
          onClick={(e) => e.stopPropagation()} // Aísla el click del drag
        >
          {isEditing ? (
            // Modo edición: input transparente sobre el texto
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}  // Guarda cuando pierde el foco
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') { setEditValue(item.name); setIsEditing(false); }
              }}
              title="Nombre del producto"
              placeholder={item.name}
              className={cn(
                'w-full bg-transparent text-base font-medium outline-none border-b',
                isDark ? 'text-white border-indigo-400' : 'text-slate-900 border-indigo-500'
              )}
            />
          ) : (
            // Modo visualización: click abre la edición (solo si no está comprado)
            <span
              onClick={() => { if (!item.purchased) setIsEditing(true); }}
              className={cn(
                'block text-base font-medium truncate transition-all',
                item.purchased
                  ? isDark ? 'line-through text-white/30' : 'line-through text-slate-400'
                  : isDark ? 'text-white cursor-text' : 'text-slate-900 cursor-text'
              )}
            >
              {item.name}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
