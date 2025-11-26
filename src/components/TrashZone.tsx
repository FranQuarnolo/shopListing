import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DeleteOutlined } from '@ant-design/icons';

export const TrashZone: React.FC<{ active: boolean }> = ({ active }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'trash-zone',
    });

    if (!active) return null;

    return (
        <div
            ref={setNodeRef}
            style={{
                position: 'fixed',
                bottom: '80px', // Above the input
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: isOver ? '#ff4d4f' : '#ffccc7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 90,
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
        >
            <DeleteOutlined style={{ fontSize: '24px', color: isOver ? '#fff' : '#ff4d4f' }} />
        </div>
    );
};
