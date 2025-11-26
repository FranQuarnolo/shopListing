import React from 'react';
import { Drawer, List, Typography, Button, Tag } from 'antd';
import { SavedList } from '../types';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface HistoryDrawerProps {
    open: boolean;
    onClose: () => void;
    history: SavedList[];
    onNewList: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
    open,
    onClose,
    history,
    onNewList,
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

            <List
                dataSource={history}
                renderItem={(list) => (
                    <List.Item
                        key={list.id}
                        style={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '16px',
                            borderBottom: '1px solid #333',
                        }}
                    >
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text strong style={{ fontSize: '16px' }}>{list.title}</Text>
                            <Tag color="blue">${list.total.toFixed(2)}</Tag>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {dayjs(list.date).format('DD/MM/YYYY HH:mm')}
                        </Text>
                        <div style={{ marginTop: '8px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {list.items.length} ítems
                            </Text>
                        </div>
                    </List.Item>
                )}
            />
        </Drawer>
    );
};
