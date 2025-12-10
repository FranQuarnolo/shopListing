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
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('shopListing_theme');
        return saved ? saved === 'dark' : true;
    });

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('shopListing_theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

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
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#9FA8DA',
                    borderRadius: 8,
                },
            }}
        >
            <Layout style={{ height: '100%', background: isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        background: isDarkMode ? 'rgba(20, 20, 20, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                    }}
                >
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => setDrawerOpen(true)}
                        style={{ color: isDarkMode ? '#fff' : '#000' }}
                    />
                    <Title level={4} style={{ margin: 0, color: isDarkMode ? '#fff' : '#000' }}>
                        Lista del Super
                    </Title>
                    <Button
                        type="text"
                        icon={<SaveOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => setSaveModalOpen(true)}
                        disabled={currentList.length === 0}
                        style={{ color: currentList.length > 0 ? '#9FA8DA' : (isDarkMode ? '#666' : '#ccc') }}
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
                    isDarkMode={isDarkMode}
                    onToggleTheme={toggleTheme}
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
