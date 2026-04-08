// ============================================================
// ShoppingList — Contenedor principal de la lista de compras
//
// Este componente:
//   1. Configura el contexto de Drag & Drop con @dnd-kit
//   2. Divide los ítems en "pendientes" y "comprados"
//   3. Muestra un estado vacío cuando no hay ítems
//   4. Renderiza la TrashZone y el QuickInput
// ============================================================

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,      // Algoritmo de detección de colisión: usa el centro del elemento
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy, // Optimización para listas verticales
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { ShoppingItem } from '../types';
import { DraggableListItem } from './DraggableListItem';
import { QuickInput } from './QuickInput';
import { TrashZone } from './TrashZone';
import { cn } from '../lib/utils';

interface ShoppingListProps {
  items: ShoppingItem[];
  isDark: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onAdd: (name: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  isDark,
  onToggle,
  onRemove,
  onEdit,
  onReorder,
  onAdd,
}) => {
  // activeId guarda el ID del ítem que está siendo arrastrado (o null si ninguno)
  const [activeId, setActiveId] = useState<string | null>(null);

  // useSensors registra los dispositivos de entrada para el drag
  // Cada sensor tiene un "activationConstraint" para no interferir con clicks normales
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 }, // Mouse: debe moverse 10px para activar el drag
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 }, // Touch: debe mantener 250ms presionado
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, // Permite usar teclado para ordenar
    })
  );

  /** Guarda el ID del ítem que empezó a arrastrarse */
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  /**
   * Se llama cuando el usuario suelta el ítem arrastrado.
   * Si lo suelto sobre la TrashZone → eliminar
   * Si lo suelto sobre otro ítem → reordenar
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return; // Soltó en un lugar vacío, sin efecto

    if (over.id === 'trash-zone') {
      onRemove(active.id as string);
      return;
    }

    if (active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  // Separamos los ítems en dos grupos para mostrarlos diferenciados
  const unpurchased = items.filter((i) => !i.purchased);
  const purchased = items.filter((i) => i.purchased);

  return (
    <>
      {/*
        DndContext provee el contexto de drag & drop a todos sus hijos.
        Todos los useSortable() dentro de este árbol pertenecen a este contexto.
      */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="px-4 pt-4 pb-32">

          {/* Estado vacío */}
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <ShoppingBag
                size={56}
                className={cn(isDark ? 'text-white/20' : 'text-slate-300')}
              />
              <p className={cn('text-base', isDark ? 'text-white/40' : 'text-slate-400')}>
                Lista vacía — ¡Agrega productos!
              </p>
            </motion.div>
          ) : (
            /*
              SortableContext provee a cada hijo la información de orden
              items debe contener los IDs en el mismo orden que se renderizan
            */
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {/* Ítems pendientes */}
              <AnimatePresence initial={false}>
                {unpurchased.map((item) => (
                  <DraggableListItem
                    key={item.id}
                    item={item}
                    isDark={isDark}
                    onToggle={onToggle}
                    onEdit={onEdit}
                  />
                ))}
              </AnimatePresence>

              {/* Sección de comprados (aparece solo si hay alguno) */}
              {purchased.length > 0 && (
                <motion.div layout>
                  <div className={cn(
                    'text-xs font-semibold uppercase tracking-widest mb-2 mt-4 px-1',
                    isDark ? 'text-white/20' : 'text-slate-300'
                  )}>
                    Comprado ({purchased.length})
                  </div>
                  <AnimatePresence initial={false}>
                    {purchased.map((item) => (
                      <DraggableListItem
                        key={item.id}
                        item={item}
                        isDark={isDark}
                        onToggle={onToggle}
                        onEdit={onEdit}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </SortableContext>
          )}
        </div>

        {/* TrashZone aparece flotante solo mientras hay un ítem siendo arrastrado */}
        <TrashZone active={!!activeId} isDark={isDark} />
      </DndContext>

      {/* Input fijo en la parte inferior de la pantalla */}
      <QuickInput onAdd={onAdd} isDark={isDark} />
    </>
  );
};
