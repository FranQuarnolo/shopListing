import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const TrashZone: React.FC<{ active: boolean; isDark: boolean }> = ({ active, isDark }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'trash-zone' });

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          ref={setNodeRef}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: isOver ? 1.15 : 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'fixed bottom-24 left-0 right-0 mx-auto z-50',
            'w-16 h-16 rounded-full flex items-center justify-center',
            'shadow-xl transition-colors duration-150',
            isOver
              ? 'bg-red-500 shadow-red-500/40'
              : isDark
              ? 'bg-red-900/60 border-2 border-red-500/50'
              : 'bg-red-100 border-2 border-red-300'
          )}
        >
          <Trash2
            size={24}
            className={cn(isOver ? 'text-white' : isDark ? 'text-red-400' : 'text-red-500')}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
