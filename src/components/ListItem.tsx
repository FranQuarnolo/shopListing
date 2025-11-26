import React from 'react';
import { Checkbox, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ShoppingItem } from '../types';

const { Text } = Typography;

interface ListItemProps {
    item: ShoppingItem;
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
}

export const ListItem: React.FC<ListItemProps> = ({ item, onToggle, onRemove }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid #333',
                backgroundColor: item.purchased ? '#1f1f1f' : 'transparent',
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
                <Checkbox
                    checked={item.purchased}
                    onChange={() => onToggle(item.id)}
                    style={{ transform: 'scale(1.2)' }}
                />
                <Text
                    delete={item.purchased}
                    style={{
                        fontSize: '16px',
                        color: item.purchased ? '#666' : '#fff',
                        flex: 1,
                    }}
                >
                    {item.name}
                </Text>
            </div>
            <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onRemove(item.id)}
            />
        </div>
    );
};
