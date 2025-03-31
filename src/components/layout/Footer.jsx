import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    YoutubeOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const AppFooter = () => {
    return (
        <Footer style={{ background: '#f0f2f5', padding: '40px 50px 20px' }}>
            <Row gutter={[32, 32]}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Title level={4}>E-Shop</Title>
                    <Text>Your one-stop shop for high-quality products. We offer a wide range of items at competitive prices, with excellent customer service and fast shipping.</Text>
                    <div style={{ marginTop: 20 }}>
                        <Space size="middle">
                            <Link href="https://facebook.com" target="_blank"><FacebookOutlined style={{ fontSize: 24 }} /></Link>
                            <Link href="https://twitter.com" target="_blank"><TwitterOutlined style={{ fontSize: 24 }} /></Link>
                            <Link href="https://instagram.com" target="_blank"><InstagramOutlined style={{ fontSize: 24 }} /></Link>
                            <Link href="https://youtube.com" target="_blank"><YoutubeOutlined style={{ fontSize: 24 }} /></Link>
                        </Space>
                    </div>
                </Col>

                <Col xs={24} sm={12} md={8} lg={8}>
                    <Title level={4}>Quick Links</Title>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: 10 }}><Link href="/">Home</Link></li>
                        <li style={{ marginBottom: 10 }}><Link href="/products">Products</Link></li>
                        <li style={{ marginBottom: 10 }}><Link href="/categories">Categories</Link></li>
                        <li style={{ marginBottom: 10 }}><Link href="/about">About Us</Link></li>
                        <li style={{ marginBottom: 10 }}><Link href="/contact">Contact Us</Link></li>
                    </ul>
                </Col>

                <Col xs={24} sm={12} md={8} lg={8}>
                    <Title level={4}>Contact Us</Title>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: 10 }}>
                            <Space>
                                <HomeOutlined />
                                <Text>123 E-Commerce Street, Digital City</Text>
                            </Space>
                        </li>
                        <li style={{ marginBottom: 10 }}>
                            <Space>
                                <PhoneOutlined />
                                <Link href="tel:+123456789">+1 (234) 567-89</Link>
                            </Space>
                        </li>
                        <li style={{ marginBottom: 10 }}>
                            <Space>
                                <MailOutlined />
                                <Link href="mailto:support@eshop.com">support@eshop.com</Link>
                            </Space>
                        </li>
                    </ul>
                </Col>
            </Row>

            <Divider />

            <div style={{ textAlign: 'center' }}>
                <Text type="secondary">© {new Date().getFullYear()} E-Shop. All rights reserved.</Text>
            </div>
        </Footer>
    );
};

export default AppFooter;