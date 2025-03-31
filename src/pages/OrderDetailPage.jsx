import React, { useState, useEffect } from 'react';
import {
    Typography,
    Breadcrumb,
    Card,
    Descriptions,
    Tag,
    Button,
    List,
    Space,
    Divider,
    Steps,
    Row,
    Col,
    Skeleton,
    Empty,
    Modal,
    message
} from 'antd';
import {
    ShoppingCartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CarOutlined,
    HomeOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ordersAPI from '../api/orders';
import paymentsAPI from '../api/payments';
import { formatCurrency } from '../utils/formatCurrency';

const { Title, Text } = Typography;
const { Step } = Steps;

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const orderResponse = await ordersAPI.getOrder(id);
                const orderData = orderResponse.data;
                setOrder(orderData);

                // Fetch payment details
                try {
                    const paymentResponse = await paymentsAPI.getOrderPayment(orderData.order_id);
                    setPayment(paymentResponse.data);
                } catch (paymentError) {
                    console.log('No payment details found or error fetching payment');
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Failed to load order details. The order may not exist or has been removed.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const handleCancelOrder = async () => {
        Modal.confirm({
            title: 'Cancel Order',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to cancel this order? This action cannot be undone.',
            okText: 'Yes, Cancel Order',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await ordersAPI.cancelOrder(id);
                    message.success('Order cancelled successfully');

                    // Refresh order data
                    const response = await ordersAPI.getOrder(id);
                    setOrder(response.data);
                } catch (err) {
                    console.error('Error cancelling order:', err);
                    message.error('Failed to cancel order. Please try again later.');
                }
            },
        });
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'pending':
                return 0;
            case 'processing':
                return 1;
            case 'shipped':
                return 2;
            case 'delivered':
                return 3;
            case 'cancelled':
                return -1;
            default:
                return 0;
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

    if (loading) {
        return (
            <div className="order-detail-page">
                <Card>
                    <Skeleton active paragraph={{ rows: 10 }} />
                </Card>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-detail-page">
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={error || "Order not found"}
                    >
                        <Button type="primary" onClick={() => navigate('/orders')}>
                            Back to Orders
                        </Button>
                    </Empty>
                </Card>
            </div>
        );
    }

    return (
        <div className="order-detail-page">
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/orders">Orders</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Order #{order.order_id}</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2} style={{ marginBottom: 24 }}>Order Details</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Space align="center">
                                <Title level={4} style={{ margin: 0 }}>
                                    Order #{order.order_id}
                                </Title>
                                <Tag color={getStatusColor(order.status)} style={{ marginLeft: 8 }}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Tag>
                            </Space>

                            {(order.status === 'pending' || order.status === 'processing') && (
                                <Button
                                    danger
                                    icon={<CloseCircleOutlined />}
                                    onClick={handleCancelOrder}
                                >
                                    Cancel Order
                                </Button>
                            )}
                        </div>

                        {order.status !== 'cancelled' && (
                            <Steps
                                current={getStatusStep(order.status)}
                                status={order.status === 'cancelled' ? 'error' : 'process'}
                                style={{ marginBottom: 32 }}
                            >
                                <Step title="Pending" icon={<ClockCircleOutlined />} />
                                <Step title="Processing" icon={<ShoppingCartOutlined />} />
                                <Step title="Shipped" icon={<CarOutlined />} />
                                <Step title="Delivered" icon={<CheckCircleOutlined />} />
                            </Steps>
                        )}

                        <Descriptions title="Order Information" bordered column={{ xs: 1, sm: 2 }}>
                            <Descriptions.Item label="Order ID">{order.order_id}</Descriptions.Item>
                            <Descriptions.Item label="Date">{new Date(order.created_at).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Payment Status">
                                <Tag color={order.payment_status ? 'green' : 'orange'}>
                                    {order.payment_status ? 'Paid' : 'Pending'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount">{formatCurrency(order.total_amount)}</Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                                <Card title="Shipping Address" bordered={false}>
                                    <Text>{order.shipping_address}</Text>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card title="Billing Address" bordered={false}>
                                    <Text>{order.billing_address}</Text>
                                </Card>
                            </Col>
                        </Row>

                        {payment && (
                            <>
                                <Divider />

                                <Descriptions title="Payment Information" bordered column={{ xs: 1, sm: 2 }}>
                                    <Descriptions.Item label="Payment Method">
                                        {payment.payment_method === 'credit_card' && 'Credit Card'}
                                        {payment.payment_method === 'paypal' && 'PayPal'}
                                        {payment.payment_method === 'bank_transfer' && 'Bank Transfer'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Transaction ID">{payment.transaction_id || 'N/A'}</Descriptions.Item>
                                    <Descriptions.Item label="Payment Date">
                                        {payment.created_at ? new Date(payment.created_at).toLocaleString() : 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Payment Status">
                                        <Tag color={payment.payment_status === 'completed' ? 'green' : 'orange'}>
                                            {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </>
                        )}
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card title="Order Items">
                        <List
                            dataSource={order.items}
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    extra={
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ marginBottom: 4 }}>
                                                <Text>{formatCurrency(item.price)} × {item.quantity}</Text>
                                            </div>
                                            <Text strong>{formatCurrency(item.price * item.quantity)}</Text>
                                        </div>
                                    }
                                >
                                    <List.Item.Meta
                                        title={
                                            <Link to={`/products/${item.product_id}`}>
                                                {item.product_name}
                                            </Link>
                                        }
                                        description={`Quantity: ${item.quantity}`}
                                    />
                                </List.Item>
                            )}
                        />

                        <Divider />

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: 8 }}>
                                <Space size="large">
                                    <Text>Subtotal:</Text>
                                    <Text>{formatCurrency(order.total_amount)}</Text>
                                </Space>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Space size="large">
                                    <Text>Shipping:</Text>
                                    <Text>{formatCurrency(0)}</Text>
                                </Space>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <Space size="large">
                                    <Text>Tax:</Text>
                                    <Text>{formatCurrency(0)}</Text>
                                </Space>
                            </div>
                            <div>
                                <Space size="large">
                                    <Text strong style={{ fontSize: 16 }}>Total:</Text>
                                    <Text strong style={{ fontSize: 16 }}>{formatCurrency(order.total_amount)}</Text>
                                </Space>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Space>
                        <Button type="primary" onClick={() => navigate('/orders')}>
                            Back to Orders
                        </Button>
                        <Button onClick={() => navigate('/products')}>
                            Continue Shopping
                        </Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default OrderDetailPage;