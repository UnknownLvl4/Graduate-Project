import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";
import customerService from "../../services/customerService";
import { useDiscounts } from "../../store/DiscountContext"; // Import the discount context

function AllProductsByCategory() {
  const [products, setProducts] = useState([]);
  const { discounts } = useDiscounts(); // Use the discount context

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await customerService.queryProducts({
        page: 1,
        limit: 1000,
      });
      const data = await response.items;
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Fetch categories from backend
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await customerService.queryCategories();
      const data = await response;
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <Container sx={{ mt: 4, paddingTop: "20px", paddingBottom: "20px" }}>
      {categories.map((category) => (
        <div key={category.id}>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            {category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <a href={`/products/${category.id}`}>Xem thêm</a>
          </Typography>
          <Grid container spacing={2}>
            {products
              .filter((product) => product.category_id === category.id)
              .slice(0, 4) // Display only the first 4 products in each category
              .map((product) => {
                const discount = discounts.find(
                  (d) => d.product_id === product.product_id
                ); // Find the discount for the product

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={product.product_id}
                  >
                    <Card
                      onClick={() =>
                        (window.location.href = `/product/${product.product_id}`)
                      }
                      sx={{ cursor: "pointer", position: "relative" }}
                    >
                      {discount && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          {discount.value}% OFF
                        </Typography>
                      )}
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        sx={{ objectFit: "contain" }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={product.product_name}
                        >
                          {product.product_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {!discount && (
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              {product.price.toLocaleString()} VND
                            </span>
                          )}
                          {discount && (
                            <>
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {parseFloat(
                                  product.price * (1 - discount.value / 100)
                                ).toLocaleString()}{" "}
                                VND
                              </span>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  marginLeft: 8,
                                  color: "gray",
                                  fontSize: "0.8em",
                                }}
                              >
                                {product.price.toLocaleString()} VND
                              </span>
                            </>
                          )}
                        </Typography>
                        <Button
                          variant="contained"
                          component={RouterLink}
                          to={`/product/${product.product_id}`}
                          sx={{ mt: 2 }}
                          fullWidth
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </div>
      ))}
    </Container>
  );
}

export default AllProductsByCategory;
