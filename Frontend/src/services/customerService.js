import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const queryProducts = async (queryParams) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error querying products:", error);
    throw error;
  }
};

const queryMostExpensiveProductByCategory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/products/most-expensive-by-category`
    );
    return response.data;
  } catch (error) {
    console.error("Error querying most expensive products by category:", error);
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

const getProductComments = async (productId) => {
  const response = await fetch(`${API_URL}/reviews/${productId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
};

const addProductComment = async (commentData) => {
  try {
    const response = await axios.post(`${API_URL}/reviews`, commentData);
    return response.data;
  } catch (error) {
    console.error("Error adding product comment:", error);
    throw error;
  }
};

const customerService = {
  queryProducts,
  queryMostExpensiveProductByCategory,
  getProductById,
  getProductComments,
  addProductComment,
};

export default customerService;
