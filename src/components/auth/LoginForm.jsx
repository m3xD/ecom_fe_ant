import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Divider, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const { Title, Text } = Typography;

const LoginForm = () => {
    const [form] = Form.useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get redirect path from location state or default to home
    const from = location.state?.from?.pathname || '/';

    const onFinish = async (values) => {
        try {
            setLoading(true);
            setError(null);
            await login(values);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 400, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>Welcome Back</Title>
                <Text type="secondary">Please login to your account</Text>
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
                name="login"
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
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a style={{ float: 'right' }} href="/forgot-password">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                        Log in
                    </Button>
                </Form.Item>

                <Divider>
                    <Text type="secondary">OR</Text>
                </Divider>

                <div style={{ textAlign: 'center' }}>
                    <Space direction="vertical">
                        <Text>Don't have an account?</Text>
                        <Link to="/register">
                            <Button type="default" size="large" block>
                                Register Now
                            </Button>
                        </Link>
                    </Space>
                </div>
            </Form>
        </Card>
    );
};

export default LoginForm;