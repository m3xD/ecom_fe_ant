import React from 'react';
import { List, Avatar, Button, InputNumber, Typography, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

const { Text } = Typography;

const CartItem = ({ item }) => {
    const { updateCartItem, removeCartItem } = useCart();
    const mediaUrl = import.meta.env.VITE_MEDIA_URL;

    const handleQuantityChange = (value) => {
        if (value >= 1) {
            updateCartItem(item.id, value);
        }
    };

    return (
        <List.Item
            actions={[
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeCartItem(item.id)}
                />
            ]}
        >
            <List.Item.Meta
                avatar={
                    <Avatar
                        shape="square"
                        size={64}
                        src={item.product?.image ? `${mediaUrl}${item.product.image}` : null}
                    />
                }
                title={item.product?.name || 'Product'}
                description={
                    <Space direction="vertical" size={0}>
                        <Text type="secondary">{item.product?.category?.name || 'Category'}</Text>
                        <Text strong>{formatCurrency(item.price)}</Text>
                    </Space>
                }
            />
            <div>
                <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    style={{ width: 60 }}
                />
                <div style={{ marginTop: 8 }}>
                    <Text strong>{formatCurrency(item.price * item.quantity)}</Text>
                </div>
            </div>
        </List.Item>
    );
};

export default CartItem;