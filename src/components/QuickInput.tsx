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
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            background: '#141414',
            borderTop: '1px solid #303030',
            display: 'flex',
            gap: '8px',
            zIndex: 100
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
