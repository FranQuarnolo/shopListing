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

    return {
        currentList,
        history,
        addItem,
        toggleItem,
        removeItem,
        saveList,
        startNewList,
    };
};
