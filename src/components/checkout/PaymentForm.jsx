import React from 'react';
import { Form, Input, Radio, Card, Row, Col, Typography, Space } from 'antd';
import {
    CreditCardOutlined,
    BankOutlined,
    UserOutlined,
    CalendarOutlined,
    NumberOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const PaymentForm = ({ initialValues, onFinish }) => {
    const [form] = Form.useForm();

    const paymentMethod = Form.useWatch('payment_method', form);

    const renderPaymentMethodFields = () => {
        switch (paymentMethod) {
            case 'credit_card':
                return (
                    <Card bordered={false} style={{ marginTop: 16 }}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="card_number"
                                    label="Card Number"
                                    rules={[
                                        { required: true, message: 'Please enter your card number' },
                                        { pattern: /^\d{16}$/, message: 'Card number must be 16 digits' }
                                    ]}
                                >
                                    <Input
                                        prefix={<CreditCardOutlined />}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={16}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="card_holder"
                                    label="Card Holder Name"
                                    rules={[{ required: true, message: 'Please enter card holder name' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="John Doe" />
                                </Form.Item>
                            </Col>

                            <Col xs={12} sm={6}>
                                <Form.Item
                                    name="expiry_date"
                                    label="Expiry Date"
                                    rules={[
                                        { required: true, message: 'Please enter expiry date' },
                                        { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Format: MM/YY' }
                                    ]}
                                >
                                    <Input prefix={<CalendarOutlined />} placeholder="MM/YY" maxLength={5} />
                                </Form.Item>
                            </Col>

                            <Col xs={12} sm={6}>
                                <Form.Item
                                    name="cvv"
                                    label="CVV"
                                    rules={[
                                        { required: true, message: 'Please enter CVV' },
                                        { pattern: /^\d{3,4}$/, message: 'CVV must be 3 or 4 digits' }
                                    ]}
                                >
                                    <Input prefix={<NumberOutlined />} placeholder="123" maxLength={4} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                );

            case 'paypal':
                return (
                    <Card bordered={false} style={{ marginTop: 16 }}>
                        <div style={{ textAlign: 'center' }}>
                            <p>You will be redirected to PayPal to complete your payment after placing your order.</p>
                        </div>
                    </Card>
                );

            case 'bank_transfer':
                return (
                    <Card bordered={false} style={{ marginTop: 16 }}>
                        <p>Please make a transfer to the following bank account:</p>
                        <Space direction="vertical">
                            <p><strong>Bank:</strong> E-Shop Bank</p>
                            <p><strong>Account Name:</strong> E-Shop Inc</p>
                            <p><strong>Account Number:</strong> 123456789</p>
                            <p><strong>Routing Number:</strong> 987654321</p>
                            <p><strong>Reference:</strong> Your order ID will be provided after you place the order</p>
                        </Space>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <Form
            form={form}
            id="payment"
            name="payment"
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Title level={4}>Payment Method</Title>

            <Form.Item
                name="payment_method"
                rules={[{ required: true, message: 'Please select a payment method' }]}
            >
                <Radio.Group>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Radio value="credit_card">
                            <Space>
                                <CreditCardOutlined /> Credit Card
                            </Space>
                        </Radio>

                        <Radio value="paypal">
                            <Space>
                                <BankOutlined /> PayPal
                            </Space>
                        </Radio>

                        <Radio value="bank_transfer">
                            <Space>
                                <BankOutlined /> Bank Transfer
                            </Space>
                        </Radio>
                    </Space>
                </Radio.Group>
            </Form.Item>

            {renderPaymentMethodFields()}
        </Form>
    );
};

export default PaymentForm;