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
import { useDiscounts } from "../../store/DiscountContext";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { discounts } = useDiscounts();

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
      name: "Laptop",
      image: "https://img.freepik.com/premium-vector/laptop-vector-mockup-647546_982290-58.jpg",
    },
    {
      id: 'PHN',
      name: "Điện thoại",
      image: "https://img.freepik.com/free-vector/smart-phone-flat-style_78370-4084.jpg",
    },
    {
      id: 'HPH',
      name: "Tai nghe",
      image: "https://thumbs.dreamstime.com/b/headphone-black-icon-isolated-white-vector-illustration-flat-web-mobile-138372498.jpg",
    },
  ];

  return (
    <>
      <Carousel />
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Những sản phẩm nổi bật
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {featuredProducts.map((product) => {
            const discount = discounts.find(
              (d) => d.product_id === product.product_id
            );
            return (
            <Grid item key={product.product_id} xs={12} sm={6} md={4}>
                <Card sx={{ position: "relative" }}>
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
                      }}>
                      {discount.value}% OFF
                    </Typography>
                  )}
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
                      {!discount && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}>
                          {product.price.toLocaleString()} VND
                        </span>
                      )}
                      {discount && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}>
                          {parseInt(
                            product.price * (1 - discount.value / 100)
                          ).toLocaleString()}{" "}
                          VND
                        </span>
                      )}
                      {discount && (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              marginLeft: 8,
                              color: "gray",
                              fontSize: "0.8em",
                            }}>
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
                    fullWidth>
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            );
          })}
        </Grid>
        {/* Categories */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Mua sắm theo danh mục
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
