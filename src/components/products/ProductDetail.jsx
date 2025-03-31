import React, { useState } from 'react';
import {
    Row,
    Col,
    Typography,
    Breadcrumb,
    Image,
    Card,
    Button,
    InputNumber,
    Space,
    Divider,
    Tag,
    Tabs,
    Descriptions
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProductDetail = ({ product, loading }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const mediaUrl = import.meta.env.VITE_MEDIA_URL;

    const handleAddToCart = () => {
        addToCart(product.id, quantity);
    };

    if (!product) {
        return null;
    }

    return (
        <div className="product-detail">
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/products">Products</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={`/categories?id=${product.category?.id}`}>{product.category?.name}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Card loading={loading}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Image
                            src={product.image ? `${mediaUrl}${product.image}` : 'https://via.placeholder.com/600x600'}
                            alt={product.name}
                            style={{ width: '100%', objectFit: 'cover' }}
                        />
                    </Col>

                    <Col xs={24} md={12}>
                        <Title level={2}>{product.name}</Title>

                        <Tag color="blue" style={{ marginBottom: 16 }}>
                            {product.category?.name}
                        </Tag>

                        <Title level={3} style={{ color: '#1890ff' }}>
                            {formatCurrency(product.price)}
                        </Title>

                        <Divider />

                        <Paragraph>
                            {product.description}
                        </Paragraph>

                        <Divider />

                        <div style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    color: product.stock > 0 ? '#52c41a' : '#f5222d',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}
                            >
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </Text>
                        </div>

                        <Space size="large" style={{ marginBottom: 24 }}>
                            <div>
                                <Text>Quantity:</Text>
                                <InputNumber
                                    min={1}
                                    max={product.stock}
                                    value={quantity}
                                    onChange={setQuantity}
                                    style={{ marginLeft: 8 }}
                                    disabled={product.stock <= 0}
                                />
                            </div>
                        </Space>

                        <Space size="middle">
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                size="large"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                Add to Cart
                            </Button>
                            <Button icon={<HeartOutlined />} size="large">
                                Add to Wishlist
                            </Button>
                            <Button icon={<ShareAltOutlined />} size="large">
                                Share
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ margin: '32px 0' }} />

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Description" key="1">
                        <Paragraph style={{ whiteSpace: 'pre-line' }}>
                            {product.description}
                        </Paragraph>
                    </TabPane>
                    <TabPane tab="Specifications" key="2">
                        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                            <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
                            <Descriptions.Item label="Category">{product.category?.name}</Descriptions.Item>
                            <Descriptions.Item label="Price">{formatCurrency(product.price)}</Descriptions.Item>
                            <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
                            <Descriptions.Item label="Added On">
                                {new Date(product.created_at).toLocaleDateString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Updated">
                                {new Date(product.updated_at).toLocaleDateString()}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default ProductDetail;