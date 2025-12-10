import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface QuickInputProps {
    onAdd: (name: string) => void;
}

export const QuickInput: React.FC<QuickInputProps> = ({ onAdd }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (value.trim()) {
            onAdd(value.trim());
            setValue('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '16px',
            right: '16px',
            padding: '12px',
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            gap: '12px',
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <Input
                placeholder="Agregar producto..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onPressEnter={handleSubmit}
                size="large"
                autoComplete="off"
                style={{ flex: 1 }}
            />
            <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleSubmit}
            />
        </div>
    );
};
