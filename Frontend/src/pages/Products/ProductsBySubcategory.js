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

function ProductsBySubcategory() {
  const { category, sub_category } = useParams(); // Get category and subcategory from URL params
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of products per page

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
        sx={{ mt: 4 }}></Typography>
      <Grid container spacing={2}>
        {currentProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              onClick={() =>
                (window.location.href = `/product/${product.product_id}`)
              }
              sx={{ cursor: "pointer" }}>
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
                  title={product.product_name}>
                  {product.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  $ {product.price}
                </Typography>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={`/product/${product.product_id}`}
                  sx={{ mt: 2 }}
                  fullWidth>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}>
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          sx={{ mr: 2 }}>
          Previous
        </Button>
        <Typography variant="body1">
          Page {currentPage} of {Math.ceil(products.length / itemsPerPage)}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
          sx={{ ml: 2 }}>
          Next
        </Button>
      </Box>
    </Container>
  );
}

export default ProductsBySubcategory;
