import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ShoppingItem, SavedList } from '../types';
import Swal from 'sweetalert2';

const STORAGE_KEY_CURRENT = 'shopListing_current';
const STORAGE_KEY_HISTORY = 'shopListing_history';

export const useShoppingList = () => {
    const [currentList, setCurrentList] = useState<ShoppingItem[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
        return saved ? JSON.parse(saved) : [];
    });

    const [history, setHistory] = useState<SavedList[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentList));
    }, [currentList]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }, [history]);

    const addItem = (name: string) => {
        const newItem: ShoppingItem = {
            id: uuidv4(),
            name,
            purchased: false,
        };
        setCurrentList((prev) => [...prev, newItem]);
    };

    const toggleItem = (id: string) => {
        setCurrentList((prev) => {
            const newList = prev.map((item) =>
                item.id === id ? { ...item, purchased: !item.purchased } : item
            );
            // Sort: Unpurchased first, then purchased
            return newList.sort((a, b) => {
                if (a.purchased === b.purchased) return 0;
                return a.purchased ? 1 : -1;
            });
        });
    };

    const removeItem = (id: string) => {
        setCurrentList((prev) => prev.filter((item) => item.id !== id));
    };

    const saveList = (title: string, total: number) => {
        if (currentList.length === 0) return;

        const newList: SavedList = {
            id: uuidv4(),
            title,
            date: dayjs().toISOString(),
            total,
            items: [...currentList],
        };

        setHistory((prev) => [newList, ...prev]);
        setCurrentList([]);
    };

    const startNewList = () => {
        Swal.fire({
            title: '¿Nueva lista?',
            text: "Se borrarán los ítems actuales no guardados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, nueva lista',
            cancelButtonText: 'Cancelar',
            background: '#1f1f1f',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                setCurrentList([]);
                Swal.fire({
                    title: '¡Lista creada!',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                    background: '#1f1f1f',
                    color: '#fff'
                });
            }
        });
    };

    const editItem = (id: string, newName: string) => {
        setCurrentList((prev) =>
            prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
        );
    };

    const reorderItems = (activeId: string, overId: string) => {
        setCurrentList((prev) => {
            const oldIndex = prev.findIndex((item) => item.id === activeId);
            const newIndex = prev.findIndex((item) => item.id === overId);

            if (oldIndex === -1 || newIndex === -1) return prev;

            const newItems = [...prev];
            const [movedItem] = newItems.splice(oldIndex, 1);
            newItems.splice(newIndex, 0, movedItem);
            return newItems;
        });
    };

    const deleteList = (id: string) => {
        Swal.fire({
            title: '¿Eliminar lista?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1f1f1f',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                setHistory((prev) => prev.filter((list) => list.id !== id));
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'La lista ha sido eliminada.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1f1f1f',
                    color: '#fff'
                });
            }
        });
    };

    const duplicateList = (list: SavedList) => {
        Swal.fire({
            title: '¿Cargar ítems?',
            text: `Se agregarán los ítems de "${list.title}" a tu lista actual.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cargar',
            cancelButtonText: 'Cancelar',
            background: '#1f1f1f',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                const currentNames = new Set(currentList.map(i => i.name.toLowerCase().trim()));
                const newItems = list.items
                    .filter(item => !currentNames.has(item.name.toLowerCase().trim()))
                    .map((item) => ({
                        ...item,
                        id: uuidv4(),
                        purchased: false,
                    }));

                if (newItems.length === 0) {
                    Swal.fire({
                        title: 'Info',
                        text: 'Todos los ítems ya están en tu lista.',
                        icon: 'info',
                        background: '#1f1f1f',
                        color: '#fff'
                    });
                    return;
                }

                setCurrentList((prev) => [...prev, ...newItems]);

                Swal.fire({
                    title: '¡Cargados!',
                    text: `Se agregaron ${newItems.length} ítems nuevos.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1f1f1f',
                    color: '#fff'
                });
            }
        });
    };

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
    };
};
