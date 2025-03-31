import React, { useState } from 'react';
import { Steps, Button, message, Card, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import ordersAPI from '../../api/orders';
import paymentsAPI from '../../api/payments';

const { Step } = Steps;

const steps = [
    {
        title: 'Shipping',
        content: 'shipping',
    },
    {
        title: 'Payment',
        content: 'payment',
    },
    {
        title: 'Review',
        content: 'review',
    },
];

const CheckoutForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { cart, clearCart, refreshCart } = useCart();

    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [shippingData, setShippingData] = useState({
        shipping_address: currentUser?.address || '',
        billing_address: currentUser?.address || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        name: `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim(),
        use_different_billing: false,
    });
    const [paymentData, setPaymentData] = useState({
        payment_method: 'credit_card',
        card_number: '',
        card_holder: '',
        expiry_date: '',
        cvv: '',
    });
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const handleShippingSubmit = (values) => {
        setShippingData(values);
        next();
    };

    const handlePaymentSubmit = (values) => {
        setPaymentData(values);
        next();
    };

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);

            // Create order
            const orderData = {
                user_id: currentUser.id,
                total_amount: cart.total,
                shipping_address: shippingData.shipping_address,
                billing_address: shippingData.use_different_billing
                    ? shippingData.billing_address
                    : shippingData.shipping_address,
                status: 'pending',
            };

            const orderResponse = await ordersAPI.createOrder(orderData);
            const order = orderResponse.data;
            setOrderId(order.order_id);

            // Process payment - Thay đổi biến paymentData2 thành paymentData
            const paymentRequest = {  // Đổi tên biến này từ paymentData2 sang paymentRequest
                order_id: order.order_id,
                user_id: currentUser.id,
                amount: order.total_amount,
                payment_method: paymentData.payment_method,
                payment_details: {
                    card_number: paymentData.card_number,
                    cardholder_name: paymentData.card_holder,
                    expiry_date: paymentData.expiry_date,
                },
            };

            await paymentsAPI.createPayment(paymentRequest);

            // Clear cart
            await clearCart();

            // Update cart state
            await refreshCart();

            // Show success
            setOrderComplete(true);
            message.success('Order placed successfully!');
        } catch (error) {
            console.error('Checkout error:', error);
            message.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        if (orderComplete) {
            return (
                <Result
                    status="success"
                    title="Order Placed Successfully!"
                    subTitle={`Order number: ${orderId}. We'll send a confirmation when your order ships.`}
                    extra={[
                        <Button type="primary" key="orders" onClick={() => navigate('/orders')}>
                            View Orders
                        </Button>,
                        <Button key="shop" onClick={() => navigate('/products')}>
                            Continue Shopping
                        </Button>,
                    ]}
                />
            );
        }

        switch (steps[current].content) {
            case 'shipping':
                return <ShippingForm initialValues={shippingData} onFinish={handleShippingSubmit} />;
            case 'payment':
                return <PaymentForm initialValues={paymentData} onFinish={handlePaymentSubmit} />;
            case 'review':
                return (
                    <OrderSummary
                        cart={cart}
                        shippingData={shippingData}
                        paymentData={paymentData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Card>
            <Steps current={current} style={{ marginBottom: 24 }}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>

            <div className="steps-content">{renderStepContent()}</div>

            {!orderComplete && (
                <div className="steps-action" style={{ marginTop: 24 }}>
                    <Space>
                        {current > 0 && (
                            <Button onClick={prev} disabled={loading}>
                                Previous
                            </Button>
                        )}

                        {current < steps.length - 1 && (
                            <Button type="primary" form={steps[current].content} htmlType="submit" loading={loading}>
                                Next
                            </Button>
                        )}

                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={handlePlaceOrder} loading={loading}>
                                Place Order
                            </Button>
                        )}
                    </Space>
                </div>
            )}
        </Card>
    );
};

export default CheckoutForm;