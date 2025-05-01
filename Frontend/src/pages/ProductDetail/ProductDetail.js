import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Grid, Paper, Box, Button } from "@mui/material";
import * as CusomterService from "../../services/customerService";
import ProductComments from "../../components/ProductComments/ProductComments";

function ProductDetail() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              disabled={product.stock_quantity === 0}>
              {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
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
