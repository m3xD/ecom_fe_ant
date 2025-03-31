import React from 'react';
import { Card, Typography, Button, Rate, Tag, Badge } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const mediaUrl = import.meta.env.VITE_MEDIA_URL;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id);
    };

    const getStockBadge = () => {
        if (product.stock <= 0) {
            return <Badge.Ribbon text="Out of Stock" color="red" />;
        }
        if (product.stock < 10) {
            return <Badge.Ribbon text="Low Stock" color="orange" />;
        }
        return null;
    };

    return (
        <Badge.Ribbon {...(getStockBadge() ? getStockBadge().props : { text: '', style: { display: 'none' } })}>
            <Link to={`/products/${product.id}`}>
                <Card
                    hoverable
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    cover={
                        <div style={{ height: 200, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                alt={product.name}
                                src={product.image ? `${mediaUrl}${product.image}` : 'https://via.placeholder.com/300'}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </div>
                    }
                    actions={[
                        <Button
                            icon={<EyeOutlined />}
                            type="text"
                        >
                            View
                        </Button>,
                        <Button
                            icon={<ShoppingCartOutlined />}
                            type="primary"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            Add to Cart
                        </Button>
                    ]}
                >
                    <Meta
                        title={product.name}
                        description={
                            <div style={{ height: 60, overflow: 'hidden' }}>
                                <div style={{ marginBottom: 8 }}>
                                    <Tag color="blue">{product.category?.name}</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 16 }}>{formatCurrency(product.price)}</Text>
                                    <Text type={product.stock > 0 ? 'success' : 'danger'}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </Text>
                                </div>
                            </div>
                        }
                    />
                </Card>
            </Link>
        </Badge.Ribbon>
    );
};

export default ProductCard;