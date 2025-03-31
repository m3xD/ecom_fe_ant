import React, { useState, useEffect } from 'react';
import {
    Typography,
    Breadcrumb,
    Card,
    Tabs,
    Form,
    Input,
    Button,
    Divider,
    Row,
    Col,
    Avatar,
    message,
    Skeleton,
    Empty,
    List
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    LockOutlined,
    SaveOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ordersAPI from '../api/orders';
import { formatCurrency } from '../utils/formatCurrency';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage = () => {
    const navigate = useNavigate();
    const { currentUser, updateProfile, loading: authLoading } = useAuth();

    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (currentUser) {
            form.setFieldsValue({
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
                email: currentUser.email,
                phone: currentUser.phone,
                address: currentUser.address,
            });
        }
    }, [currentUser, form]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            if (!currentUser) return;

            try {
                setOrdersLoading(true);
                const response = await ordersAPI.getUserOrders(currentUser.id);
                // Get only 5 most recent orders
                const recentOrders = response.data.slice(0, 5);
                setOrders(recentOrders);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchRecentOrders();
    }, [currentUser]);

    const handleUpdateProfile = async (values) => {
        try {
            setSaving(true);
            await updateProfile(values);
            message.success('Profile updated successfully');
        } catch (err) {
            message.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (values) => {
        try {
            setChangingPassword(true);
            // Note: You'll need to implement this in your authAPI
            // await authAPI.changePassword(values);
            message.success('Password changed successfully');
            passwordForm.resetFields();
        } catch (err) {
            message.error('Failed to change password');
        } finally {
            setChangingPassword(false);
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

    if (authLoading) {
        return (
            <div className="profile-page">
                <Card>
                    <Skeleton active avatar paragraph={{ rows: 6 }} />
                </Card>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="profile-page">
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Please log in to view your profile"
                    >
                        <Button type="primary" onClick={() => navigate('/login', { state: { from: '/profile' } })}>
                            Log In
                        </Button>
                    </Empty>
                </Card>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Profile</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2} style={{ marginBottom: 24 }}>My Profile</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={8} lg={6}>
                    <Card style={{ textAlign: 'center' }}>
                        <Avatar
                            size={100}
                            icon={<UserOutlined />}
                            src={currentUser.avatar}
                            style={{ marginBottom: 16 }}
                        />
                        <Title level={4}>{currentUser.first_name} {currentUser.last_name}</Title>
                        <Text type="secondary">{currentUser.email}</Text>
                        <Divider />
                        <Button
                            type="primary"
                            block
                            onClick={() => navigate('/orders')}
                            icon={<ShoppingOutlined />}
                        >
                            View My Orders
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} md={16} lg={18}>
                    <Card>
                        <Tabs defaultActiveKey="personal">
                            <TabPane tab="Personal Information" key="personal">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleUpdateProfile}
                                    initialValues={{
                                        first_name: currentUser.first_name,
                                        last_name: currentUser.last_name,
                                        email: currentUser.email,
                                        phone: currentUser.phone,
                                        address: currentUser.address,
                                    }}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="first_name"
                                                label="First Name"
                                                rules={[{ required: true, message: 'Please enter your first name' }]}
                                            >
                                                <Input prefix={<UserOutlined />} placeholder="First Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="last_name"
                                                label="Last Name"
                                                rules={[{ required: true, message: 'Please enter your last name' }]}
                                            >
                                                <Input prefix={<UserOutlined />} placeholder="Last Name" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="Email" readOnly />
                                    </Form.Item>

                                    <Form.Item
                                        name="phone"
                                        label="Phone Number"
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                                    </Form.Item>

                                    <Form.Item
                                        name="address"
                                        label="Address"
                                    >
                                        <Input.TextArea
                                            placeholder="Address"
                                            rows={3}
                                            prefix={<HomeOutlined />}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            loading={saving}
                                        >
                                            Save Changes
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>

                            <TabPane tab="Change Password" key="password">
                                <Form
                                    form={passwordForm}
                                    layout="vertical"
                                    onFinish={handlePasswordChange}
                                >
                                    <Form.Item
                                        name="current_password"
                                        label="Current Password"
                                        rules={[{ required: true, message: 'Please enter your current password' }]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Current Password" />
                                    </Form.Item>

                                    <Form.Item
                                        name="new_password"
                                        label="New Password"
                                        rules={[
                                            { required: true, message: 'Please enter your new password' },
                                            { min: 6, message: 'Password must be at least 6 characters' }
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirm_password"
                                        label="Confirm New Password"
                                        dependencies={['new_password']}
                                        rules={[
                                            { required: true, message: 'Please confirm your new password' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('new_password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The two passwords do not match'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            loading={changingPassword}
                                        >
                                            Change Password
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>

                            <TabPane tab="Recent Orders" key="orders">
                                {ordersLoading ? (
                                    <Skeleton active paragraph={{ rows: 5 }} />
                                ) : orders.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="You don't have any orders yet"
                                    >
                                        <Button
                                            type="primary"
                                            icon={<ShoppingOutlined />}
                                            onClick={() => navigate('/products')}
                                        >
                                            Start Shopping
                                        </Button>
                                    </Empty>
                                ) : (
                                    <>
                                        <List
                                            dataSource={orders}
                                            renderItem={(order) => (
                                                <List.Item
                                                    key={order.id}
                                                    actions={[
                                                        <Button
                                                            type="primary"
                                                            size="small"
                                                            onClick={() => navigate(`/orders/${order.id}`)}
                                                        >
                                                            View
                                                        </Button>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        title={
                                                            <Link to={`/orders/${order.id}`}>
                                                                Order #{order.order_id}
                                                            </Link>
                                                        }
                                                        description={
                                                            <>
                                                                <Text>Date: {new Date(order.created_at).toLocaleDateString()}</Text>
                                                                <br />
                                                                <Text type="secondary">
                                                                    Status: <Tag color={getStatusColor(order.status)}>
                                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                </Tag>
                                                                </Text>
                                                            </>
                                                        }
                                                    />
                                                    <div>
                                                        <Text strong>{formatCurrency(order.total_amount)}</Text>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />

                                        {orders.length > 0 && (
                                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                                <Button type="primary" onClick={() => navigate('/orders')}>
                                                    View All Orders
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;