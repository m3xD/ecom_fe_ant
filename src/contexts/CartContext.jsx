import React, { createContext, useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import cartAPI from '../api/cart';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);

    // Fetch user's cart when authenticated
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            fetchUserCart();
        } else {
            // Clear cart when user logs out
            setCart(null);
        }
    }, [isAuthenticated, currentUser]);

    const fetchUserCart = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const response = await cartAPI.getUserCart(currentUser.id);
            setCart(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch cart';
            setError(errorMessage);
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            message.warning('Please login to add items to cart');
            return;
        }

        try {
            setLoading(true);
            const cartData = {
                cart: cart.id,
                product_id: productId,
                quantity: quantity
            };

            const response = await cartAPI.addToCart(cartData);

            // Refresh cart after adding item
            await fetchUserCart();

            message.success('Item added to cart!');
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to add item to cart';
            message.error(errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            setLoading(true);
            await cartAPI.updateCartItem(itemId, { quantity });

            // Refresh cart after updating
            await fetchUserCart();

            message.success('Cart updated!');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to update cart';
            message.error(errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeCartItem = async (itemId) => {
        try {
            setLoading(true);
            await cartAPI.removeCartItem(itemId);

            // Refresh cart after removing item
            await fetchUserCart();

            message.success('Item removed from cart!');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to remove item from cart';
            message.error(errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (!cart) return;

        try {
            setLoading(true);
            await cartAPI.clearCart(cart.id);

            // Refresh cart after clearing
            await fetchUserCart();

            message.success('Cart cleared!');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to clear cart';
            message.error(errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const openCart = () => {
        setCartOpen(true);
    };

    const closeCart = () => {
        setCartOpen(false);
    };

    const getCartItemsCount = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.total || 0;
    };

    const value = {
        cart,
        loading,
        error,
        cartOpen,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        openCart,
        closeCart,
        getCartItemsCount,
        getCartTotal,
        refreshCart: fetchUserCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};