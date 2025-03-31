import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const { Title, Text } = Typography;

const RegisterForm = () => {
    const [form] = Form.useForm();
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            setError(null);
            await register(values);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 500, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>Create Account</Title>
                <Text type="secondary">Please fill in the form to register</Text>
            </div>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Username"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password2"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm Password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="first_name"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input
                        prefix={<UserAddOutlined />}
                        placeholder="First Name"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="last_name"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input
                        prefix={<UserAddOutlined />}
                        placeholder="Last Name"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Phone Number (Optional)"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="address"
                >
                    <Input.TextArea
                        prefix={<HomeOutlined />}
                        placeholder="Address (Optional)"
                        size="large"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                        Register
                    </Button>
                </Form.Item>

                <Divider>
                    <Text type="secondary">OR</Text>
                </Divider>

                <div style={{ textAlign: 'center' }}>
                    <Space direction="vertical">
                        <Text>Already have an account?</Text>
                        <Link to="/login">
                            <Button type="default" size="large" block>
                                Login
                            </Button>
                        </Link>
                    </Space>
                </div>
            </Form>
        </Card>
    );
};

export default RegisterForm;