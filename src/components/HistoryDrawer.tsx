import React from 'react';
import { Drawer, Button, Typography, Collapse, Tag, Space, Popconfirm } from 'antd';
import { SavedList } from '../types';
import dayjs from 'dayjs';
import { PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Panel } = Collapse;

interface HistoryDrawerProps {
    open: boolean;
    onClose: () => void;
    history: SavedList[];
    onNewList: () => void;
    onDeleteList: (id: string) => void;
    onDuplicateList: (list: SavedList) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
    open,
    onClose,
    history,
    onNewList,
    onDeleteList,
    onDuplicateList,
}) => {
    return (
        <Drawer
            title="Mis Compras"
            placement="left"
            onClose={onClose}
            open={open}
            styles={{ body: { padding: 0 } }}
            width="85%"
        >
            <div style={{ padding: '16px', borderBottom: '1px solid #333' }}>
                <Button
                    type="primary"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => {
                        onNewList();
                        onClose();
                    }}
                    size="large"
                >
                    Nueva Lista
                </Button>
            </div>

            <div style={{ padding: '16px' }}>
                {history.length === 0 ? (
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
                        No tienes listas guardadas.
                    </Text>
                ) : (
                    <Collapse accordion ghost>
                        {history.map((list) => (
                            <Panel
                                key={list.id}
                                header={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <div>
                                            <Text strong style={{ display: 'block' }}>{list.title}</Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {dayjs(list.date).format('DD/MM/YYYY')}
                                            </Text>
                                        </div>
                                        <Tag color="blue">${list.total.toFixed(2)}</Tag>
                                    </div>
                                }
                            >
                                <div style={{ marginBottom: '16px' }}>
                                    {list.items.map((item) => (
                                        <div key={item.id} style={{ padding: '4px 0', borderBottom: '1px solid #303030' }}>
                                            <Text style={{ color: item.purchased ? '#ffffff4d' : '#fff' }}>
                                                {item.name}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Popconfirm
                                        title="Eliminar lista"
                                        description="¿Estás seguro de eliminar esta lista?"
                                        onConfirm={() => onDeleteList(list.id)}
                                        okText="Sí"
                                        cancelText="No"
                                    >
                                        <Button danger icon={<DeleteOutlined />} size="small">
                                            Eliminar
                                        </Button>
                                    </Popconfirm>

                                    <Button
                                        type="primary"
                                        ghost
                                        icon={<CopyOutlined />}
                                        size="small"
                                        onClick={() => {
                                            onDuplicateList(list);
                                            onClose();
                                        }}
                                    >
                                        Cargar Items
                                    </Button>
                                </Space>
                            </Panel>
                        ))}
                    </Collapse>
                )}
            </div>
        </Drawer>
    );
};
