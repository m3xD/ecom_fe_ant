import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Input, Badge, Button, Dropdown, Space, Avatar } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuOutlined,
    SearchOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const { Header } = Layout;
const { Search } = Input;

const AppHeader = () => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, logout } = useAuth();
    const { openCart, getCartItemsCount } = useCart();

    const handleSearch = (value) => {
        if (value) {
            navigate(`/products?search=${encodeURIComponent(value)}`);
        }
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">My Profile</Link>
            </Menu.Item>
            <Menu.Item key="orders" icon={<MenuOutlined />}>
                <Link to="/orders">My Orders</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className="app-header" style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="logo" style={{ width: 150 }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        E-Shop
                    </Link>
                </div>

                <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ flex: 1, border: 'none' }}>
                    <Menu.Item key="home">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="products">
                        <Link to="/products">Products</Link>
                    </Menu.Item>
                    <Menu.Item key="categories">
                        <Link to="/categories">Categories</Link>
                    </Menu.Item>
                </Menu>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Search
                        placeholder="Search products..."
                        onSearch={handleSearch}
                        style={{ width: 250 }}
                    />

                    <Badge count={getCartItemsCount()} showZero>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                            onClick={openCart}
                            size="large"
                        />
                    </Badge>

                    {isAuthenticated ? (
                        <Dropdown overlay={userMenu} trigger={['click']}>
                            <Button type="text">
                                <Space>
                                    <Avatar icon={<UserOutlined />} src={currentUser?.avatar} />
                                    {currentUser?.username || 'User'}
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Space>
                            <Button type="text" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button type="primary" onClick={() => navigate('/register')}>
                                Register
                            </Button>
                        </Space>
                    )}
                </div>
            </div>
        </Header>
    );
};

export default AppHeader;