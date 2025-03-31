import React from 'react';
import { Card, Typography, List, Divider, Row, Col, Descriptions } from 'antd';
import { formatCurrency } from '../../utils/formatCurrency';

const { Title, Text } = Typography;

const OrderSummary = ({ cart, shippingData, paymentData }) => {
    if (!cart || !cart.items) {
        return <div>Loading cart information...</div>;
    }

    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'credit_card':
                return 'Credit Card';
            case 'paypal':
                return 'PayPal';
            case 'bank_transfer':
                return 'Bank Transfer';
            default:
                return method;
        }
    };

    const renderPaymentDetails = () => {
        if (paymentData.payment_method === 'credit_card') {
            return (
                <>
                    <p>Card Number: **** **** **** {paymentData.card_number.slice(-4)}</p>
                    <p>Card Holder: {paymentData.card_holder}</p>
                    <p>Expiry Date: {paymentData.expiry_date}</p>
                </>
            );
        }
        return <p>Payment will be processed after order confirmation.</p>;
    };

    return (
        <div className="order-summary">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                    <Card title="Order Items" bordered={false}>
                        <List
                            dataSource={cart.items}
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    extra={
                                        <div style={{ textAlign: 'right' }}>
                                            <Text>{formatCurrency(item.price)} × {item.quantity}</Text>
                                            <div>
                                                <Text strong>{formatCurrency(item.price * item.quantity)}</Text>
                                            </div>
                                        </div>
                                    }
                                >
                                    <List.Item.Meta
                                        title={item.product?.name || 'Product'}
                                        description={`Quantity: ${item.quantity}`}
                                    />
                                </List.Item>
                            )}
                        />

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Subtotal</Text>
                            <Text>{formatCurrency(cart.total)}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                            <Text>Shipping</Text>
                            <Text>{formatCurrency(0)}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                            <Text>Tax</Text>
                            <Text>{formatCurrency(0)}</Text>
                        </div>

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text strong>Total</Text>
                            <Text strong style={{ fontSize: 18 }}>{formatCurrency(cart.total)}</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Shipping Information" bordered={false} style={{ marginBottom: 16 }}>
                        <p><strong>Name:</strong> {shippingData.name}</p>
                        <p><strong>Email:</strong> {shippingData.email}</p>
                        <p><strong>Phone:</strong> {shippingData.phone}</p>
                        <Divider />
                        <p><strong>Shipping Address:</strong></p>
                        <p>{shippingData.shipping_address}</p>

                        {shippingData.use_different_billing && (
                            <>
                                <Divider />
                                <p><strong>Billing Address:</strong></p>
                                <p>{shippingData.billing_address}</p>
                            </>
                        )}
                    </Card>

                    <Card title="Payment Information" bordered={false}>
                        <p><strong>Payment Method:</strong> {getPaymentMethodName(paymentData.payment_method)}</p>
                        <Divider />
                        {renderPaymentDetails()}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OrderSummary;