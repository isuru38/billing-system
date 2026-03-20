import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// ── Products ──
export const getProducts          = ()         => api.get('/products');
export const getAvailableProducts = ()         => api.get('/products/available');
export const createProduct        = (data)     => api.post('/products', data);
export const updateProduct        = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct        = (id)       => api.delete(`/products/${id}`);
export const searchProducts       = (keyword)  => api.get(`/products/search?keyword=${keyword}`);

// ── Customers ──
export const getCustomers         = ()         => api.get('/customers');
export const createCustomer       = (data)     => api.post('/customers', data);
export const updateCustomer       = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer       = (id)       => api.delete(`/customers/${id}`);
export const searchCustomers      = (keyword)  => api.get(`/customers/search?keyword=${keyword}`);

// ── Orders ──
export const getOrders            = ()         => api.get('/orders');
export const getTodaysOrders      = ()         => api.get('/orders/today');
export const createOrder          = (data)     => api.post('/orders', data);
export const getOrderById         = (id)       => api.get(`/orders/${id}`);

// ── Invoices ──
export const getInvoices          = ()         => api.get('/invoices');
export const getInvoiceById       = (id)       => api.get(`/invoices/${id}`);
export const getInvoiceByOrder    = (orderId)  => api.get(`/invoices/order/${orderId}`);

// ── Reports ──
export const getDailyReport       = (date)     => api.get(`/reports/daily?date=${date}`);
export const getRevenueSummary    = ()         => api.get('/reports/revenue');
export const getTopProducts       = ()         => api.get('/reports/top-products');

export default api;