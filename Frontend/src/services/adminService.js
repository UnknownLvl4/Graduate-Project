import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Products
export const getProducts = async (page = 1, limit = 10, category = '') => {
  return axios.get(`${API_URL}/products`, {
    params: { page, limit, category }
  });
};

export const getProduct = async (categoryId, productId) => {
  return axios.get(`${API_URL}/products/${categoryId}/${productId}`);
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'image' && productData[key] instanceof File) {
      formData.append('image', productData[key]);
    } else {
      formData.append(key, productData[key]);
    }
  });
  
  return axios.post(`${API_URL}/products`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateProduct = async (categoryId, productId, productData) => {
  console.log(productData);
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'image' && productData[key] instanceof File) {
      formData.append('image', productData[key]);
    } else {
      formData.append(key, productData[key]);
    }
  });

  return axios.put(`${API_URL}/products/${categoryId}/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteProduct = async (categoryId, productId) => {
  return axios.delete(`${API_URL}/products/${categoryId}/${productId}`);
};

export const bulkDeleteProducts = async (ids) => {
  return axios.delete(`${API_URL}/products`, { data: ids });
};

// Categories
export const getCategories = () => axios.get(`${API_URL}/categories`);
export const createCategory = (data) => axios.post(`${API_URL}/categories`, data);
export const updateCategory = (id, data) => axios.put(`${API_URL}/categories/${id}`, data);
export const deleteCategory = (id) => axios.delete(`${API_URL}/categories/${id}`);

// Orders
export const getOrders = async () => {
  return axios.get(`${API_URL}/bills`);
};

export const updateOrder = (id, data) => axios.put(`${API_URL}/bills/${id}`, data);

// Users
export const getUsers = async () => {
  return axios.get(`${API_URL}/users`);
};

export const updateUser = (id, data) => axios.put(`${API_URL}/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_URL}/users/${id}`);