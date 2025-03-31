import React from 'react';
import { Drawer, Button, Empty, List, Typography, Space, Divider, InputNumber } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import CartItem from './CartItem';
import { formatCurrency } from '../../utils/formatCurrency';

const { Title, Text } = Typography;

const CartDrawer = () => {
    const navigate = useNavigate();
    const { cartOpen, closeCart, cart, loading, clearCart, getCartTotal } = useCart();
    const { isAuthenticated } = useAuth();

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        closeCart();
        navigate('/products');
    };

    return (
        <Drawer
            title={
                <Space>
                    <ShoppingCartOutlined />
                    <span>Your Cart</span>
                </Space>
            }
            placement="right"
            width={420}
            onClose={closeCart}
            open={cartOpen}
            footer={
                <div style={{ padding: '10px 0' }}>
                    {cart && cart.items && cart.items.length > 0 && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text strong>Total:</Text>
                                <Text strong>{formatCurrency(getCartTotal())}</Text>
                            </div>

                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Button onClick={handleContinueShopping}>
                                    Continue Shopping
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleCheckout}
                                    disabled={!isAuthenticated}
                                >
                                    Checkout
                                </Button>
                            </Space>

                            {!isAuthenticated && (
                                <div style={{ marginTop: 8, textAlign: 'center' }}>
                                    <Text type="secondary">Please login to checkout</Text>
                                </div>
                            )}
                        </>
                    )}
                </div>
            }
        >
            {!isAuthenticated ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Title level={5}>Please login to view your cart</Title>
                    <Button type="primary" onClick={() => {
                        closeCart();
                        navigate('/login');
                    }}>
                        Login
                    </Button>
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text>Loading your cart...</Text>
                </div>
            ) : !cart || !cart.items || cart.items.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Your cart is empty"
                >
                    <Button type="primary" onClick={handleContinueShopping}>
                        Start Shopping
                    </Button>
                </Empty>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                    </div>

                    <List
                        dataSource={cart.items}
                        renderItem={item => (
                            <CartItem item={item} />
                        )}
                    />
                </div>
            )}
        </Drawer>
    );
};

export default CartDrawer;