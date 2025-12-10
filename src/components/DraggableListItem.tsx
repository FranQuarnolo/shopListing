import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox, Input, Typography, InputRef } from 'antd';
import { ShoppingItem } from '../types';

const { Text } = Typography;

interface DraggableListItemProps {
    item: ShoppingItem;
    onToggle: (id: string) => void;
    onEdit: (id: string, newName: string) => void;
}

export const DraggableListItem: React.FC<DraggableListItemProps> = ({ item, onToggle, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '12px',
        background: 'rgba(30, 30, 30, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(item.name);
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editValue.trim() && editValue !== item.name) {
            onEdit(item.id, editValue.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Checkbox
                checked={item.purchased}
                onChange={() => onToggle(item.id)}
                style={{ marginRight: '12px', transform: 'scale(1.2)' }}
            />

            <div style={{ flex: 1, textAlign: 'left' }}>
                {isEditing ? (
                    <Input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        variant="borderless"
                        style={{
                            padding: 0,
                            fontSize: '18px',
                            background: 'transparent',
                            color: '#fff'
                        }}
                    />
                ) : (
                    <Text
                        delete={item.purchased}
                        onClick={() => setIsEditing(true)}
                        style={{
                            fontSize: '18px',
                            color: item.purchased ? '#ffffff4d' : '#fff',
                            display: 'block',
                            cursor: 'text'
                        }}
                    >
                        {item.name}
                    </Text>
                )}
            </div>
        </div>
    );
};
