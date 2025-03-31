import React from 'react';
import { Row, Col, Empty, Spin, Pagination } from 'antd';
import ProductCard from './ProductCard';

const ProductList = ({
                         products,
                         loading,
                         total,
                         page = 1,
                         pageSize = 12,
                         onPageChange
                     }) => {
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <Empty
                description="No products found"
                style={{ padding: '50px 0' }}
            />
        );
    }

    return (
        <div>
            <Row gutter={[16, 16]}>
                {products.map(product => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>

            {total > pageSize && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        onChange={onPageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductList;