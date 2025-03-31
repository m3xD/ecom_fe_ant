import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Breadcrumb,
    Card,
    Row,
    Col,
    Select,
    Input,
    Slider,
    Button,
    Space,
    Divider,
    Tag
} from 'antd';
import { FilterOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import productsAPI from '../api/products';

const { Title, Text } = Typography;
const { Option } = Select;
const { Sider, Content } = Layout;

const ProductsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        search: queryParams.get('search') || '',
        category: queryParams.get('category') || '',
        minPrice: queryParams.get('minPrice') || 0,
        maxPrice: queryParams.get('maxPrice') || 1000,
        sort: queryParams.get('sort') || 'newest',
    });
    const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
    const pageSize = 12;

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productsAPI.getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch products when filters or pagination change
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Build query params
                const params = {
                    page,
                    page_size: pageSize,
                };

                if (filters.search) params.search = filters.search;
                if (filters.category) params.category = filters.category;
                if (filters.minPrice > 0) params.min_price = filters.minPrice;
                if (filters.maxPrice < 1000) params.max_price = filters.maxPrice;

                switch (filters.sort) {
                    case 'price_low':
                        params.ordering = 'price';
                        break;
                    case 'price_high':
                        params.ordering = '-price';
                        break;
                    case 'newest':
                        params.ordering = '-created_at';
                        break;
                    default:
                        params.ordering = '-created_at';
                }

                let response;
                if (filters.category) {
                    response = await productsAPI.getProductsByCategory(filters.category);
                } else {
                    response = await productsAPI.getProducts(params);
                }

                // Update state with API response
                setProducts(response.data.results || response.data);
                setTotal(response.data.count || response.data.length);

                // Update URL with current filters
                const searchParams = new URLSearchParams();
                if (filters.search) searchParams.set('search', filters.search);
                if (filters.category) searchParams.set('category', filters.category);
                if (filters.minPrice > 0) searchParams.set('minPrice', filters.minPrice);
                if (filters.maxPrice < 1000) searchParams.set('maxPrice', filters.maxPrice);
                if (filters.sort) searchParams.set('sort', filters.sort);
                if (page > 1) searchParams.set('page', page);

                const newUrl = `${location.pathname}?${searchParams.toString()}`;
                navigate(newUrl, { replace: true });
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters, page, navigate, location.pathname]);

    const handleSearch = (value) => {
        setFilters({ ...filters, search: value });
        setPage(1);
    };

    const handleCategoryChange = (value) => {
        setFilters({ ...filters, category: value });
        setPage(1);
    };

    const handlePriceChange = (value) => {
        setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] });
        setPage(1);
    };

    const handleSortChange = (value) => {
        setFilters({ ...filters, sort: value });
        setPage(1);
    };

    const handlePageChange = (page) => {
        setPage(page);
        window.scrollTo(0, 0);
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            category: '',
            minPrice: 0,
            maxPrice: 1000,
            sort: 'newest',
        });
        setPage(1);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id.toString() === categoryId);
        return category ? category.name : 'All Categories';
    };

    return (
        <div className="products-page">
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Products</Breadcrumb.Item>
                {filters.category && (
                    <Breadcrumb.Item>{getCategoryName(filters.category)}</Breadcrumb.Item>
                )}
            </Breadcrumb>

            <Row gutter={[24, 24]}>
                {/* Filters Sidebar */}
                <Col xs={24} md={6}>
                    <Card title="Filters" extra={
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleResetFilters}
                            type="text"
                            size="small"
                        >
                            Reset
                        </Button>
                    }>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Search</Text>
                                <Input
                                    placeholder="Search products..."
                                    prefix={<SearchOutlined />}
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    onPressEnter={(e) => handleSearch(e.target.value)}
                                    style={{ marginTop: 8 }}
                                />
                            </div>

                            <Divider />

                            <div>
                                <Text strong>Category</Text>
                                <Select
                                    placeholder="Select a category"
                                    style={{ width: '100%', marginTop: 8 }}
                                    value={filters.category || undefined}
                                    onChange={handleCategoryChange}
                                    allowClear
                                >
                                    {categories.map(category => (
                                        <Option key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            <Divider />

                            <div>
                                <Text strong>Price Range</Text>
                                <Slider
                                    range
                                    min={0}
                                    max={1000}
                                    value={[filters.minPrice, filters.maxPrice]}
                                    onChange={handlePriceChange}
                                    style={{ marginTop: 16 }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Text>${filters.minPrice}</Text>
                                    <Text>${filters.maxPrice}</Text>
                                </div>
                            </div>

                            <Divider />

                            <div>
                                <Text strong>Sort By</Text>
                                <Select
                                    style={{ width: '100%', marginTop: 8 }}
                                    value={filters.sort}
                                    onChange={handleSortChange}
                                >
                                    <Option value="newest">Newest First</Option>
                                    <Option value="price_low">Price: Low to High</Option>
                                    <Option value="price_high">Price: High to Low</Option>
                                </Select>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Products List */}
                <Col xs={24} md={18}>
                    <Card>
                        <div style={{ marginBottom: 16 }}>
                            <Space align="center" style={{ marginBottom: 16 }}>
                                <Title level={3} style={{ margin: 0 }}>
                                    {filters.category
                                        ? `${getCategoryName(filters.category)}`
                                        : 'All Products'}
                                </Title>
                                {filters.search && (
                                    <Tag color="blue">
                                        Search: {filters.search}
                                    </Tag>
                                )}
                            </Space>
                            <Text type="secondary">
                                {total} products found
                            </Text>
                        </div>

                        <ProductList
                            products={products}
                            loading={loading}
                            total={total}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductsPage;