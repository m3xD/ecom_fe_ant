import React from 'react';
import { Typography, Row, Col } from 'antd';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const { isAuthenticated } = useAuth();

    // If already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <Row justify="center" align="middle" style={{ padding: '40px 0' }}>
            <Col xs={22} sm={20} md={16} lg={14} xl={12}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={1}>Create an Account</Title>
                    <Text>Join our community to start shopping and manage your orders</Text>
                </div>

                <RegisterForm />
            </Col>
        </Row>
    );
};

export default RegisterPage;