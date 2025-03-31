import React from 'react';
import { Form, Input, Checkbox, Typography, Divider, Row, Col } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const ShippingForm = ({ initialValues, onFinish }) => {
    const [form] = Form.useForm();

    const useDifferentBillingAddress = Form.useWatch('use_different_billing', form);

    return (
        <Form
            form={form}
            id="shipping"
            name="shipping"
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Title level={4}>Contact Information</Title>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
                <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>

            <Divider />

            <Title level={4}>Shipping Address</Title>

            <Form.Item
                name="shipping_address"
                label="Shipping Address"
                rules={[{ required: true, message: 'Please enter your shipping address' }]}
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Street address, city, state, zip code"
                    prefix={<HomeOutlined />}
                />
            </Form.Item>

            <Form.Item name="use_different_billing" valuePropName="checked">
                <Checkbox>Use a different billing address</Checkbox>
            </Form.Item>

            {useDifferentBillingAddress && (
                <>
                    <Divider />

                    <Title level={4}>Billing Address</Title>

                    <Form.Item
                        name="billing_address"
                        label="Billing Address"
                        rules={[{ required: true, message: 'Please enter your billing address' }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Street address, city, state, zip code"
                            prefix={<HomeOutlined />}
                        />
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default ShippingForm;