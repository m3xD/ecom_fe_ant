import React, { useState, useEffect } from 'react';
import {
    Typography,
    Breadcrumb,
    Card,
    Table,
    Tag,
    Button,
    Space,
    Tabs,
    Badge,
    Empty,
    Skeleton
} from 'antd';
import {
    ShoppingOutlined,
    EyeOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ordersAPI from '../api/orders';
import { formatCurrency } from '../utils/formatCurrency';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const OrdersPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated || !currentUser) return;

            try {
                setLoading(true);
                const response = await ordersAPI.getUserOrders(currentUser.id);
                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, currentUser]);

    const handleCancelOrder = async (orderId) => {
        try {
            await ordersAPI.cancelOrder(orderId);
            // Refresh orders after cancellation
            const response = await ordersAPI.getUserOrders(currentUser.id);
            setOrders(response.data);
        } catch (err) {
            console.error('Error cancelling order:', err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'blue';
            case 'processing':
                return 'orange';
            case 'shipped':
                return 'purple';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    };

    const getPaymentStatusColor = (paid) => {
        return paid ? 'green' : 'orange';
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            key: 'order_id',
            render: (text) => <Text copyable>{text}</Text>,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Payment',
            dataIndex: 'payment_status',
            key: 'payment_status',
            render: (paid) => (
                <Tag color={getPaymentStatusColor(paid)}>
                    {paid ? 'Paid' : 'Pending'}
                </Tag>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/orders/${record.id}`)}
                    >
                        View
                    </Button>

                    {(record.status === 'pending' || record.status === 'processing') && (
                        <Button
                            danger
                            size="small"
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleCancelOrder(record.id)}
                        >
                            Cancel
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    if (!isAuthenticated) {
        return (
            <div className="orders-page">
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Orders</Breadcrumb.Item>
                </Breadcrumb>

                <Title level={2}>My Orders</Title>

                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Please log in to view your orders"
                    >
                        <Button type="primary" onClick={() => navigate('/login', { state: { from: '/orders' } })}>
                            Log In
                        </Button>
                    </Empty>
                </Card>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Orders</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2}>My Orders</Title>

            {loading ? (
                <Card>
                    <Skeleton active paragraph={{ rows: 5 }} />
                </Card>
            ) : error ? (
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={error}
                    >
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </Empty>
                </Card>
            ) : orders.length === 0 ? (
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="You don't have any orders yet"
                    >
                        <Button
                            type="primary"
                            icon={<ShoppingOutlined />}
                            onClick={() => navigate('/products')}
                        >
                            Start Shopping
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <Card>
                    <Tabs defaultActiveKey="all">
                        <TabPane
                            tab={
                                <span>
                  All Orders
                  <Badge count={orders.length} style={{ marginLeft: 8 }} />
                </span>
                            }
                            key="all"
                        >
                            <Table
                                columns={columns}
                                dataSource={orders}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                  Active
                  <Badge
                      count={orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                      style={{ marginLeft: 8 }}
                  />
                </span>
                            }
                            key="active"
                        >
                            <Table
                                columns={columns}
                                dataSource={orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status))}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                  Completed
                  <Badge
                      count={orders.filter(o => o.status === 'delivered').length}
                      style={{ marginLeft: 8 }}
                  />
                </span>
                            }
                            key="completed"
                        >
                            <Table
                                columns={columns}
                                dataSource={orders.filter(o => o.status === 'delivered')}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                  Cancelled
                  <Badge
                      count={orders.filter(o => o.status === 'cancelled').length}
                      style={{ marginLeft: 8 }}
                  />
                </span>
                            }
                            key="cancelled"
                        >
                            <Table
                                columns={columns}
                                dataSource={orders.filter(o => o.status === 'cancelled')}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
            )}
        </div>
    );
};

export default OrdersPage;