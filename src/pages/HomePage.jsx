import React, { useEffect, useState } from 'react';
import { Typography, Carousel, Card, Row, Col, Button, Divider, Space, Skeleton } from 'antd';
import { RightOutlined, ShoppingOutlined, TagOutlined, GiftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import productsAPI from '../api/products';

const { Title, Text } = Typography;

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch products
                const productsResponse = await productsAPI.getProducts();
                const products = productsResponse.data.results || productsResponse.data;
                setFeaturedProducts(products.slice(0, 8)); // Get first 8 products

                // Fetch categories
                const categoriesResponse = await productsAPI.getCategories();
                const categoriesData = categoriesResponse.data.results || categoriesResponse.data;
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching homepage data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const carouselItems = [
        {
            title: 'Summer Collection 2025',
            subtitle: 'New arrivals with fresh styles',
            background: '#1890ff',
            textColor: '#fff',
            imageUrl: 'https://placehold.co/800x400'
        },
        {
            title: 'Special Offers',
            subtitle: 'Up to 50% off on selected items',
            background: '#52c41a',
            textColor: '#fff',
            imageUrl: 'https://placehold.co/800x400'
        },
        {
            title: 'Free Shipping',
            subtitle: 'On orders over $50',
            background: '#722ed1',
            textColor: '#fff',
            imageUrl: 'https://placehold.co/800x400'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Carousel */}
            <Carousel autoplay>
                {carouselItems.map((item, index) => (
                    <div key={index}>
                        <div
                            style={{
                                height: 400,
                                color: item.textColor,
                                background: item.background,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 50px',
                            }}
                        >
                            <div style={{ maxWidth: 500 }}>
                                <Title level={1} style={{ color: item.textColor, margin: 0 }}>
                                    {item.title}
                                </Title>
                                <Text style={{ color: item.textColor, fontSize: 18 }}>
                                    {item.subtitle}
                                </Text>
                                <div style={{ marginTop: 24 }}>
                                    <Link to="/products">
                                        <Button type="primary" size="large">
                                            Shop Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    style={{ maxHeight: 300, maxWidth: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* Features */}
            <div style={{ padding: '40px 0' }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Space align="start">
                                <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                                <div>
                                    <Title level={4}>Free Shipping</Title>
                                    <Text>On orders over $50</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Space align="start">
                                <TagOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                                <div>
                                    <Title level={4}>Best Prices</Title>
                                    <Text>Guaranteed low prices</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Space align="start">
                                <GiftOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                                <div>
                                    <Title level={4}>Easy Returns</Title>
                                    <Text>30-day return policy</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Featured Products */}
            <div style={{ padding: '20px 0 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Title level={2}>Featured Products</Title>
                    <Link to="/products">
                        <Button type="link">
                            View All <RightOutlined />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <Row gutter={[16, 16]}>
                        {[...Array(4)].map((_, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <Card>
                                    <Skeleton active avatar paragraph={{ rows: 2 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Row gutter={[16, 16]}>
                        {featuredProducts.map(product => (
                            <Col xs={24} sm={12} md={6} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Categories */}
            <div style={{ padding: '20px 0 60px' }}>
                <Title level={2} style={{ marginBottom: 24 }}>Shop by Category</Title>

                {loading ? (
                    <Row gutter={[16, 16]}>
                        {[...Array(3)].map((_, index) => (
                            <Col xs={24} sm={8} key={index}>
                                <Card>
                                    <Skeleton active paragraph={{ rows: 1 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Row gutter={[16, 16]}>
                        {categories.slice(0, 6).map(category => (
                            <Col xs={24} sm={12} md={8} key={category.id}>
                                <Link to={`/products?category=${category.id}`}>
                                    <Card hoverable>
                                        <div style={{ textAlign: 'center' }}>
                                            <Title level={4}>{category.name}</Title>
                                            <Text type="secondary">{category.description}</Text>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    );
};

export default HomePage;