import { useState } from 'react';
import { Layout, Button, ConfigProvider, theme, Typography } from 'antd';
import { MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { useShoppingList } from './hooks/useShoppingList';
import { ShoppingList } from './components/ShoppingList';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SaveListModal } from './components/SaveListModal';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
    const {
        currentList,
        history,
        addItem,
        toggleItem,
        removeItem,
        editItem,
        reorderItems,
        saveList,
        startNewList,
        deleteList,
        duplicateList,
    } = useShoppingList();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);

    // Calculate estimated total if we had prices, but for now just 0 or sum of items if we added price field.
    // Since we didn't add price to items yet, default total is 0.
    const currentTotal = 0;

    const handleSave = (title: string, total: number) => {
        // We need to update useShoppingList to accept title and total
        // But wait, saveList in hook only takes title currently and calculates total from items.
        // I need to update the hook to accept total override or just update the item prices?
        // The user wants "monto total de dicha compra".
        // I'll update the hook to accept total as an argument.
        saveList(title, total);
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#9FA8DA',
                    borderRadius: 8,
                },
            }}
        >
            <Layout style={{ height: '100%' }}>
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        background: '#141414',
                        borderBottom: '1px solid #303030',
                    }}
                >
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => setDrawerOpen(true)}
                        style={{ color: '#fff' }}
                    />
                    <Title level={4} style={{ margin: 0, color: '#fff' }}>
                        Lista del Super
                    </Title>
                    <Button
                        type="text"
                        icon={<SaveOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => setSaveModalOpen(true)}
                        disabled={currentList.length === 0}
                        style={{ color: currentList.length > 0 ? '#9FA8DA' : '#666' }}
                    />
                </Header>

                <Content style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
                    <ShoppingList
                        items={currentList}
                        onToggle={toggleItem}
                        onRemove={removeItem}
                        onEdit={editItem}
                        onReorder={reorderItems}
                        onAdd={addItem}
                    />
                </Content>

                <HistoryDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    history={history}
                    onNewList={startNewList}
                    onDeleteList={deleteList}
                    onDuplicateList={duplicateList}
                />

                <SaveListModal
                    open={saveModalOpen}
                    onClose={() => setSaveModalOpen(false)}
                    onSave={handleSave}
                    defaultTotal={currentTotal}
                />
            </Layout>
        </ConfigProvider>
    );
}

export default App;
