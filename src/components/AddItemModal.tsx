import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, InputRef } from 'antd';

interface AddItemModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (name: string) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleOk = () => {
        if (name.trim()) {
            onAdd(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <Modal
            title="Agregar Producto"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Agregar"
            cancelText="Cancelar"
        >
            <Input
                ref={inputRef}
                placeholder="Ej: Leche, Pan, Huevos..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onPressEnter={handleOk}
                size="large"
            />
        </Modal>
    );
};
