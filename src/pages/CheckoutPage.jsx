import React, { useEffect } from 'react';
import { Typography, Breadcrumb, Row, Col, Alert } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

const { Title } = Typography;

const CheckoutPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const { cart, refreshCart, loading: cartLoading } = useCart();

    useEffect(() => {
        // Refresh cart when component mounts
        if (isAuthenticated && currentUser) {
            refreshCart();
        }
    }, [isAuthenticated, currentUser]);

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
    }

    // Redirect to cart if cart is empty
    /*if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
        return <Navigate to="/cart" replace />;
    }*/

    return (
        <div className="checkout-page">
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/cart">Cart</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Checkout</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2} style={{ marginBottom: 24 }}>Checkout</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Alert
                        message="Secure Checkout"
                        description="Your information is secure and encrypted. We value your privacy."
                        type="info"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />

                    <CheckoutForm />
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;