import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;

const LoginPage = () => {
    const { isAuthenticated } = useAuth();

    // If already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 250px)' }}>
            <Col xs={22} sm={20} md={16} lg={12} xl={10}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={1}>Welcome Back</Title>
                    <Text>Log in to access your account and manage your orders</Text>
                </div>

                <LoginForm />
            </Col>
        </Row>
    );
};

export default LoginPage;