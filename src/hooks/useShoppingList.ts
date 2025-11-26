import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ShoppingItem, SavedList } from '../types';

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
        if (window.confirm('¿Estás seguro de querer empezar una nueva lista? Se borrarán los ítems actuales no guardados.')) {
            setCurrentList([]);
        }
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
        if (window.confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
            setHistory((prev) => prev.filter((list) => list.id !== id));
        }
    };

    const duplicateList = (list: SavedList) => {
        if (window.confirm(`¿Quieres agregar los ${list.items.length} ítems de "${list.title}" a tu lista actual?`)) {
            const newItems = list.items.map((item) => ({
                ...item,
                id: uuidv4(),
                purchased: false,
            }));
            setCurrentList((prev) => [...prev, ...newItems]);
        }
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
