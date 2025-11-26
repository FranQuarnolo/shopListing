import React from 'react';
import { Modal, Input, InputNumber, Form } from 'antd';
import dayjs from 'dayjs';

interface SaveListModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (title: string, total: number) => void;
    defaultTotal: number;
}

export const SaveListModal: React.FC<SaveListModalProps> = ({
    open,
    onClose,
    onSave,
    defaultTotal,
}) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then((values) => {
            onSave(values.title, values.total);
            form.resetFields();
            onClose();
        });
    };

    return (
        <Modal
            title="Guardar Compra"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Guardar"
            cancelText="Cancelar"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    title: `Compra ${dayjs().format('DD/MM')}`,
                    total: defaultTotal,
                }}
            >
                <Form.Item
                    name="title"
                    label="Título de la compra"
                    rules={[{ required: true, message: 'Por favor ingresa un título' }]}
                >
                    <Input placeholder="Ej: Compra Semanal" size="large" />
                </Form.Item>
                <Form.Item
                    name="total"
                    label="Monto Total ($)"
                    rules={[{ required: true, message: 'Por favor ingresa el monto' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        size="large"
                        min={0}
                        precision={2}
                        prefix="$"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
