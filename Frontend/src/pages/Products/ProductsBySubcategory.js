import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
} from "@mui/material";
import customerService from "../../services/customerService";
import { useDiscounts } from "../../store/DiscountContext"; // Import the discount context

function ProductsBySubcategory() {
  const { category, sub_category } = useParams(); // Get category and subcategory from URL params
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of products per page
  const { discounts } = useDiscounts(); // Use the discount context

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await customerService.queryProducts({
        page: 1,
        limit: 1000,
      });
      const data = await response.items;
      setProducts(
        data.filter(
          (product) =>
            product.category_id === category &&
            product.sub_category_id === sub_category
        )
      );
    };

    fetchProducts();
  }, [category, sub_category]);

  // Calculate the products to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container sx={{ mt: 4, paddingTop: "20px", paddingBottom: "20px" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 4 }}
      ></Typography>
      <Grid container spacing={2}>
        {currentProducts.map((product) => {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          sx={{ mr: 2 }}
        >
          Trang trước
        </Button>
        <Typography variant="body1">
          Trang {currentPage} trên {Math.ceil(products.length / itemsPerPage)}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
          sx={{ ml: 2 }}
        >
          Trang sau
        </Button>
      </Box>
    </Container>
  );
}

export default ProductsBySubcategory;
