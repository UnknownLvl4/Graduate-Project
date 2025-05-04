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
import { useParams } from "react-router-dom";
import customerService from "../../services/customerService";
import { useDiscounts } from "../../store/DiscountContext"; // Import the discount context

function ProductsByCategory() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { discounts } = useDiscounts(); // Use the discount context

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await customerService.queryProducts({
        page: 1,
        limit: 1000,
      });
      const data = await response.items;
      setProducts(data.filter((product) => product.category_id === category));
    };

    const fetchSubCategories = async () => {
      const response = await customerService.querySubCategories();
      const data = await response;
      setSubCategories(
        data.filter((subcategory) => subcategory.category_id === category)
      );
    };

    fetchProducts();
    fetchSubCategories();
  }, [category]);

  return (
    <Container sx={{ mt: 4, paddingTop: "20px", paddingBottom: "20px" }}>
      {subCategories.map((subcategory) => (
        <div key={subcategory.id}>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            {subcategory.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <a href={`/products/${category}/${subcategory.id}`}>Xem thêm</a>
          </Typography>
          <Grid container spacing={2}>
            {products
              .filter(
                (product) =>
                  product.category_id === category &&
                  product.sub_category_id === subcategory.id
              )
              .slice(0, 4) // Limit to 4 products per subcategory
              .map((product) => {
                const discount = discounts.find(
                  (d) => d.product_id === product.product_id
                ); // Find the discount for the product

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
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

export default ProductsByCategory;
