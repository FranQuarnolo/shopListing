import React from 'react';
import { Empty } from 'antd';
import { ShoppingItem } from '../types';
import { ListItem } from './ListItem';

interface ShoppingListProps {
    items: ShoppingItem[];
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onToggle, onRemove }) => {
    if (items.length === 0) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Empty description="Lista vacía. ¡Agrega cosas para comprar!" />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            {items.map((item) => (
                <ListItem
                    key={item.id}
                    item={item}
                    onToggle={onToggle}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};
