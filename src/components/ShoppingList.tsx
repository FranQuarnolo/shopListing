import React, { useState } from 'react';
import { Empty } from 'antd';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    TouchSensor,
    MouseSensor
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ShoppingItem } from '../types';
import { DraggableListItem } from './DraggableListItem';
import { QuickInput } from './QuickInput';
import { TrashZone } from './TrashZone';

interface ShoppingListProps {
    items: ShoppingItem[];
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    onEdit: (id: string, newName: string) => void;
    onReorder: (activeId: string, overId: string) => void;
    onAdd: (name: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
    items,
    onToggle,
    onRemove,
    onEdit,
    onReorder,
    onAdd
}) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        if (over.id === 'trash-zone') {
            onRemove(active.id as string);
            return;
        }

        if (active.id !== over.id) {
            onReorder(active.id as string, over.id as string);
        }
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div style={{ paddingBottom: '100px' }}>
                    {items.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <Empty description="Lista vacía. ¡Agrega cosas para comprar!" />
                        </div>
                    ) : (
                        <SortableContext
                            items={items.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((item) => (
                                <DraggableListItem
                                    key={item.id}
                                    item={item}
                                    onToggle={onToggle}
                                    onEdit={onEdit}
                                />
                            ))}
                        </SortableContext>
                    )}
                </div>

                <TrashZone active={!!activeId} />
            </DndContext>

            <QuickInput onAdd={onAdd} />
        </>
    );
};
