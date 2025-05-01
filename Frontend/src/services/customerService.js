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
    const response = await axios.get(`${API_URL}/products/most-expensive-by-category`);
    return response.data;
  } catch (error) {
    console.error("Error querying most expensive products by category:", error);
    throw error;
  }
};

const customerService = {
  queryProducts,
  queryMostExpensiveProductByCategory,
};

export default customerService;
