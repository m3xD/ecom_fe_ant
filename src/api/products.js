import apiClient from './axios';

export const productsAPI = {
    getProducts: (params) => {
        return apiClient.get('/products/api/products/', { params });
    },

    getProduct: (productId) => {
        return apiClient.get(`/products/api/products/${productId}/`);
    },

    getCategories: () => {
        return apiClient.get('/products/api/products/categories/');
    },

    getProductsByCategory: (categoryId) => {
        return apiClient.get(`/products/api/products/by_category/?category_id=${categoryId}`);
    },

    searchProducts: (query) => {
        return apiClient.get('/products/api/products/', {
            params: { search: query }
        });
    }
};

export default productsAPI;