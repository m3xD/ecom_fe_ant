import React, { useEffect } from 'react';
import {
    Typography,
    Breadcrumb,
    Card,
    Button,
    Table,
    InputNumber,
    Image,
    Space,
    Empty,
    Divider,
    Row,
    Col,
    Skeleton,
    Popconfirm
} from 'antd';
import {
    DeleteOutlined,
    ShoppingOutlined,
    ArrowRightOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';

const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const {
        cart,
        loading,
        updateCartItem,
        removeCartItem,
        clearCart,
        refreshCart,
        getCartTotal
    } = useCart();
    const { isAuthenticated, currentUser } = useAuth();
    const mediaUrl = import.meta.env.VITE_MEDIA_URL;

    useEffect(() => {
        // Refresh cart when component mounts
        if (isAuthenticated && currentUser) {
            refreshCart();
        }
    }, [isAuthenticated, currentUser]);

    const handleQuantityChange = (record, value) => {
        if (value >= 1) {
            updateCartItem(record.id, value);
        }
    };

    const handleRemoveItem = (itemId) => {
        removeCartItem(itemId);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <Space size="middle">
                    <Image
                        width={80}
                        src={record.product?.image ? `${mediaUrl}${record.product.image}` : 'https://via.placeholder.com/80'}
                        alt={record.product?.name}
                        preview={false}
                    />
                    <div>
                        <Link to={`/products/${record.product_id}`}>
                            <Text strong>{record.product?.name || 'Product'}</Text>
                        </Link>
                        <div>
                            <Text type="secondary">{record.product?.category?.name || 'Category'}</Text>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatCurrency(price),
            width: 120,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record, value)}
                    style={{ width: 60 }}
                />
            ),
            width: 120,
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => formatCurrency(record.price * record.quantity),
            width: 120,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Remove this item?"
                    description="Are you sure you want to remove this item from your cart?"
                    onConfirm={() => handleRemoveItem(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            ),
            width: 80,
        },
    ];

    return (
        <div className="cart-page">
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Cart</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2}>Shopping Cart</Title>
                {cart && cart.items && cart.items.length > 0 && (
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={refreshCart}
                    >
                        Refresh Cart
                    </Button>
                )}
            </div>

            {!isAuthenticated ? (
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Please log in to view your cart"
                    >
                        <Button type="primary" onClick={() => navigate('/login', { state: { from: '/cart' } })}>
                            Log In
                        </Button>
                    </Empty>
                </Card>
            ) : loading ? (
                <Card>
                    <Skeleton active paragraph={{ rows: 5 }} />
                </Card>
            ) : !cart || !cart.items || cart.items.length === 0 ? (
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Your cart is empty"
                    >
                        <Button
                            type="primary"
                            icon={<ShoppingOutlined />}
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={18}>
                        <Card>
                            <Table
                                columns={columns}
                                dataSource={cart.items}
                                rowKey="id"
                                pagination={false}
                                footer={() => (
                                    <div style={{ textAlign: 'right' }}>
                                        <Popconfirm
                                            title="Clear cart?"
                                            description="Are you sure you want to remove all items from your cart?"
                                            onConfirm={handleClearCart}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button danger>
                                                Clear Cart
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                )}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={6}>
                        <Card title="Order Summary">
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text>Subtotal</Text>
                                    <Text>{formatCurrency(getCartTotal())}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text>Shipping</Text>
                                    <Text>{formatCurrency(0)}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text>Tax</Text>
                                    <Text>{formatCurrency(0)}</Text>
                                </div>

                                <Divider />

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <Text strong style={{ fontSize: 16 }}>Total</Text>
                                    <Text strong style={{ fontSize: 16 }}>{formatCurrency(getCartTotal())}</Text>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    block
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceed to Checkout
                                </Button>

                                <Divider />

                                <Button
                                    block
                                    icon={<ShoppingOutlined />}
                                    onClick={() => navigate('/products')}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default CartPage;