import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Copy, Search, ArrowUpDown, Download, Upload, Sun, Moon, ChevronDown } from 'lucide-react';
import { SavedList, SortOrder } from '../types';
import dayjs from 'dayjs';
import { cn } from '../lib/utils';

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: SavedList[];
  isDark: boolean;
  onNewList: () => void;
  onDeleteList: (id: string) => void;
  onDuplicateList: (list: SavedList) => void;
  onToggleTheme: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

const SORT_LABELS: Record<SortOrder, string> = {
  'date-desc': 'Más reciente',
  'date-asc': 'Más antigua',
  'name-asc': 'Nombre A-Z',
  'total-desc': 'Mayor monto',
};

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  open,
  onClose,
  history,
  isDark,
  onNewList,
  onDeleteList,
  onDuplicateList,
  onToggleTheme,
  onExport,
  onImport,
}) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOrder>('date-desc');
  const [showSort, setShowSort] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = history
    .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'date-desc') return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
      if (sort === 'date-asc') return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
      if (sort === 'name-asc') return a.title.localeCompare(b.title);
      if (sort === 'total-desc') return b.total - a.total;
      return 0;
    });

  const base = isDark
    ? 'bg-slate-900 text-white border-white/10'
    : 'bg-white text-slate-900 border-slate-200';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className={cn(
              'fixed left-0 top-0 bottom-0 z-40 w-[85vw] max-w-sm flex flex-col border-r',
              base
            )}
          >
            {/* Header */}
            <div className={cn('flex items-center justify-between px-4 h-14 shrink-0 border-b', isDark ? 'border-white/10' : 'border-slate-200')}>
              <h2 className="font-semibold text-base">Mis Compras</h2>
              <button type="button" title="Cerrar" onClick={onClose} className={cn('p-2 rounded-xl', isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100')}>
                <X size={18} />
              </button>
            </div>

            {/* Actions */}
            <div className={cn('px-4 py-3 flex gap-2 border-b shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
              <button
                type="button"
                onClick={onNewList}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                <Plus size={16} /> Nueva Lista
              </button>
              <button
                type="button"
                title="Exportar"
                onClick={onExport}
                className={cn('p-2.5 rounded-xl transition-colors', isDark ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')}
              >
                <Download size={16} />
              </button>
              <button
                type="button"
                title="Importar"
                onClick={() => fileRef.current?.click()}
                className={cn('p-2.5 rounded-xl transition-colors', isDark ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')}
              >
                <Upload size={16} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                title="Importar archivo"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ''; }}
              />
            </div>

            {/* Search + Sort */}
            <div className={cn('px-4 py-2 flex gap-2 shrink-0 border-b', isDark ? 'border-white/10' : 'border-slate-200')}>
              <div className={cn('flex-1 flex items-center gap-2 rounded-xl px-3 py-2', isDark ? 'bg-white/8' : 'bg-slate-100')}>
                <Search size={14} className={cn(isDark ? 'text-white/40' : 'text-slate-400')} />
                <input
                  type="search"
                  placeholder="Buscar lista..."
                  title="Buscar lista"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn('flex-1 bg-transparent text-sm outline-none', isDark ? 'text-white placeholder:text-white/30' : 'text-slate-900 placeholder:text-slate-400')}
                />
              </div>
              <div className="relative">
                <button
                  type="button"
                  title="Ordenar"
                  onClick={() => setShowSort((s) => !s)}
                  className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors', isDark ? 'bg-white/8 text-white/70 hover:bg-white/15' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                >
                  <ArrowUpDown size={14} />
                  <span className="hidden sm:inline">{SORT_LABELS[sort]}</span>
                </button>
                <AnimatePresence>
                  {showSort && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      className={cn('absolute right-0 top-full mt-1 z-50 rounded-xl shadow-xl border p-1 w-40', isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200')}
                    >
                      {(Object.keys(SORT_LABELS) as SortOrder[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setSort(s); setShowSort(false); }}
                          className={cn(
                            'w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                            s === sort
                              ? 'bg-indigo-500 text-white'
                              : isDark ? 'text-white/70 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                          )}
                        >
                          {SORT_LABELS[s]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
              {filtered.length === 0 ? (
                <p className={cn('text-center text-sm mt-8', isDark ? 'text-white/40' : 'text-slate-400')}>
                  {history.length === 0 ? 'No hay listas guardadas' : 'Sin resultados'}
                </p>
              ) : (
                <AnimatePresence initial={false}>
                  {filtered.map((list) => (
                    <motion.div
                      key={list.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      className={cn('mx-3 mb-2 rounded-2xl border overflow-hidden', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}
                    >
                      {/* Row header */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === list.id ? null : list.id)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className={cn('font-medium text-sm truncate', isDark ? 'text-white' : 'text-slate-900')}>{list.title}</div>
                          <div className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-slate-400')}>
                            {dayjs(list.date).format('DD/MM/YYYY')} · {list.items.length} ítems
                          </div>
                        </div>
                        <span className={cn('text-sm font-semibold tabular-nums shrink-0', isDark ? 'text-indigo-300' : 'text-indigo-600')}>
                          ${list.total.toFixed(2)}
                        </span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'shrink-0 transition-transform',
                            isDark ? 'text-white/30' : 'text-slate-400',
                            expandedId === list.id && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedId === list.id && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={cn('mx-4 mb-3 rounded-xl p-3', isDark ? 'bg-white/5' : 'bg-white')}>
                              {list.items.map((item) => (
                                <div key={item.id} className={cn('py-1.5 flex items-center justify-between border-b last:border-0', isDark ? 'border-white/5' : 'border-slate-100')}>
                                  <span className={cn('text-sm', item.purchased ? (isDark ? 'line-through text-white/30' : 'line-through text-slate-400') : (isDark ? 'text-white/80' : 'text-slate-700'))}>
                                    {item.name}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="px-4 pb-3 flex gap-2">
                              {confirmDeleteId === list.id ? (
                                <>
                                  <span className={cn('flex-1 text-xs self-center', isDark ? 'text-white/60' : 'text-slate-500')}>¿Eliminar?</span>
                                  <button
                                    type="button"
                                    onClick={() => { onDeleteList(list.id); setConfirmDeleteId(null); setExpandedId(null); }}
                                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium"
                                  >
                                    Sí, borrar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium', isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600')}
                                  >
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(list.id)}
                                    className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', isDark ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60' : 'bg-red-50 text-red-500 hover:bg-red-100')}
                                  >
                                    <Trash2 size={12} /> Eliminar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDuplicateList(list)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                                  >
                                    <Copy size={12} /> Cargar ítems
                                  </button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className={cn('px-4 pt-3 pb-4 shrink-0 border-t space-y-3', isDark ? 'border-white/10' : 'border-slate-200')}>
              <button
                type="button"
                onClick={onToggleTheme}
                className={cn('w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors', isDark ? 'bg-white/10 hover:bg-white/15 text-white/80' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Modo Claro' : 'Modo Oscuro'}
              </button>

              {/* Versión de la app — inyectada desde package.json en build time */}
              <div className="flex items-center justify-between px-1">
                <span className={cn('text-xs', isDark ? 'text-white/25' : 'text-slate-300')}>
                  Lista del Super
                </span>
                <span className={cn(
                  'text-xs font-mono px-2 py-0.5 rounded-full border',
                  isDark
                    ? 'text-white/30 border-white/10 bg-white/5'
                    : 'text-slate-400 border-slate-200 bg-slate-50'
                )}>
                  v{__APP_VERSION__}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
