import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import Carousel from "../../components/Carousel/Carousel";
import { useEffect, useState } from "react";
import customerService from "../../services/customerService";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products =
          await customerService.queryMostExpensiveProductByCategory();

        // Map the API response directly to set featured products
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    {
      id: 'LAP',
      name: "Laptops",
      image: "https://img.freepik.com/premium-vector/laptop-vector-mockup-647546_982290-58.jpg",
    },
    {
      id: 'PHN',
      name: "Phones",
      image: "https://img.freepik.com/free-vector/smart-phone-flat-style_78370-4084.jpg",
    },
    {
      id: 'HPH',
      name: "Headphones",
      image: "https://thumbs.dreamstime.com/b/headphone-black-icon-isolated-white-vector-illustration-flat-web-mobile-138372498.jpg",
    },
  ];

  return (
    <>
      <Carousel />
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        {/* Featured Products */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Featured Products
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  src={product.image}
                  alt={product.product_name}
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {product.product_name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {product.category_name}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={`/products/${product.product_id}`}
                    sx={{ mt: 2 }}
                    fullWidth>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Categories */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <Card
                component={RouterLink}
                to={`/products?category=${category.id}`}
                sx={{
                  textDecoration: "none",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    align="center">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default Home;
