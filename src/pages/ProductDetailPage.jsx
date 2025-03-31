import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Alert, Spin } from 'antd';
import ProductDetail from '../components/products/ProductDetail';
import ProductList from '../components/products/ProductList';
import productsAPI from '../api/products';

const { Title } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch the product details
                const response = await productsAPI.getProduct(id);
                const productData = response.data;
                setProduct(productData);

                // Fetch related products from the same category
                if (productData.category) {
                    const relatedResponse = await productsAPI.getProductsByCategory(productData.category.id);
                    const relatedData = relatedResponse.data.results || relatedResponse.data;
                    // Filter out the current product and limit to 4 products
                    setRelatedProducts(
                        relatedData
                            .filter(item => item.id !== productData.id)
                            .slice(0, 4)
                    );
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product. The product may not exist or has been removed.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <Alert
                    message="Product Not Found"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button type="primary" onClick={() => navigate('/products')}>
                            Browse Products
                        </Button>
                    }
                />
            </Card>
        );
    }

    return (
        <div className="product-detail-page">
            <ProductDetail product={product} loading={loading} />

            {relatedProducts.length > 0 && (
                <div style={{ marginTop: 64, marginBottom: 24 }}>
                    <Title level={3}>Related Products</Title>
                    <ProductList products={relatedProducts} loading={false} />
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;