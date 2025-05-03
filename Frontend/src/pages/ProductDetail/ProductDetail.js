import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
} from "@mui/material";
import * as CusomterService from "../../services/customerService";
import ProductComments from "../../components/ProductComments/ProductComments";

function ProductDetail() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await CusomterService.default.getProductById(
          productId
        );
        setProduct(response);
      } catch (err) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const item = {
        user_id: JSON.parse(localStorage.getItem("user")).id,
        product_id: product.product_id,
        quantity: quantity,
      };
      const response = await CusomterService.default.addToCart(item);
      if (response) {
        alert("Thêm sản phẩm vào giỏ hàng thành công!");
        setQuantity(1);
        window.location.reload();
      } else {
        alert("Thêm sản phẩm vào giỏ hàng thất bại!");
      }
    } catch (err) {
      alert(err.message || "Thêm sản phẩm vào giỏ hàng thất bại!");
    }
  };

  const handleQuantityChange = (event) => {
    const value = Math.max(
      1,
      Math.min(product.stock_quantity, Number(event.target.value))
    );
    setQuantity(value);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={product.image || "https://via.placeholder.com/400"}
              alt={product.product_name}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.product_name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Category ID: {product.category_id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Product ID: {product.product_id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Stock: {product.stock_quantity}
              </Typography>
            </Box>
            <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                type="number"
                label="Quantity"
                variant="outlined"
                size="small"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{
                  min: 1,
                  max: product.stock_quantity,
                }}
                sx={{ width: "100px" }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={product.stock_quantity === 0}
                onClick={handleAddToCart}>
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <ProductComments productId={product.product_id} />
      </Paper>
    </Container>
  );
}

export default ProductDetail;
