import axios from 'axios';

const BASE_URL = 'https://your-backend.onrender.com/api';

// ── Products ──────────────────────────────────────
export const productService = {
    getAll: () => axios.get(`${BASE_URL}/products`),
    getById: (id) => axios.get(`${BASE_URL}/products/${id}`),
    getByCategory: (categoryId) => axios.get(`${BASE_URL}/products/category/${categoryId}`),
    search: (keyword) => axios.get(`${BASE_URL}/products/search?keyword=${keyword}`),
    create: (product) => axios.post(`${BASE_URL}/products`, product),
    update: (id, product) => axios.put(`${BASE_URL}/products/${id}`, product),
    delete: (id) => axios.delete(`${BASE_URL}/products/${id}`),
};

// ── Categories ────────────────────────────────────
export const categoryService = {
    getAll: () => axios.get(`${BASE_URL}/categories`),
    create: (category) => axios.post(`${BASE_URL}/categories`, category),
};

// ── Users ─────────────────────────────────────────
export const userService = {
    register: (user) => axios.post(`${BASE_URL}/users/register`, user),
    login: (email, password) => axios.post(`${BASE_URL}/users/login`, { email, password }),
};

// ── Orders ────────────────────────────────────────
export const orderService = {
    getAll: () => axios.get(`${BASE_URL}/orders`),
    getByUser: (userId) => axios.get(`${BASE_URL}/orders/user/${userId}`),
    getById: (id) => axios.get(`${BASE_URL}/orders/${id}`),
    place: (userId, items, shippingAddress) =>
        axios.post(`${BASE_URL}/orders/place`, { userId, items, shippingAddress }),
    updateStatus: (id, status) => axios.put(`${BASE_URL}/orders/${id}/status`, { status }),
    cancel: (id) => axios.delete(`${BASE_URL}/orders/${id}/cancel`),
};
// // src/services/api.js
// // All backend API calls are here — easy to update if URL changes

// import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/api';

// // ── Products ──────────────────────────────────────
// export const productService = {
//     getAll: () => axios.get(`${BASE_URL}/products`),
//     getById: (id) => axios.get(`${BASE_URL}/products/${id}`),
//     getByCategory: (categoryId) => axios.get(`${BASE_URL}/products/category/${categoryId}`),
//     search: (keyword) => axios.get(`${BASE_URL}/products/search?keyword=${keyword}`),
//     create: (product) => axios.post(`${BASE_URL}/products`, product),
//     update: (id, product) => axios.put(`${BASE_URL}/products/${id}`, product),
//     delete: (id) => axios.delete(`${BASE_URL}/products/${id}`),
// };

// // ── Categories ────────────────────────────────────
// export const categoryService = {
//     getAll: () => axios.get(`${BASE_URL}/categories`),
//     create: (category) => axios.post(`${BASE_URL}/categories`, category),
// };

// // ── Users ─────────────────────────────────────────
// export const userService = {
//     register: (user) => axios.post(`${BASE_URL}/users/register`, user),
//     login: (email, password) => axios.post(`${BASE_URL}/users/login`, { email, password }),
// };

// // ── Orders ────────────────────────────────────────
// export const orderService = {
//     getAll: () => axios.get(`${BASE_URL}/orders`),
//     getByUser: (userId) => axios.get(`${BASE_URL}/orders/user/${userId}`),
//     getById: (id) => axios.get(`${BASE_URL}/orders/${id}`),
//     place: (userId, items, shippingAddress) =>
//         axios.post(`${BASE_URL}/orders/place`, { userId, items, shippingAddress }),
//     updateStatus: (id, status) => axios.put(`${BASE_URL}/orders/${id}/status`, { status }),
//     cancel: (id) => axios.delete(`${BASE_URL}/orders/${id}/cancel`),
// };
