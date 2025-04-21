import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import Carousel from '../../components/Carousel/Carousel';

function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Latest Smartphone',
      image: 'https://via.placeholder.com/300x200',
      price: '$999',
      category: 'Phones',
    },
    {
      id: 2,
      name: 'Gaming Laptop',
      image: 'https://via.placeholder.com/300x200',
      price: '$1499',
      category: 'Laptops',
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      image: 'https://via.placeholder.com/300x200',
      price: '$199',
      category: 'Headphones',
    },
  ];

  const categories = [
    {
      id: 1,
      name: 'Laptops',
      image: 'https://via.placeholder.com/200x200',
    },
    {
      id: 2,
      name: 'Phones',
      image: 'https://via.placeholder.com/200x200',
    },
    {
      id: 3,
      name: 'Headphones',
      image: 'https://via.placeholder.com/200x200',
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
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {product.category}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={`/products/${product.id}`}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
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
                to={`/products?category=${category.name.toLowerCase()}`}
                sx={{
                  textDecoration: 'none',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" align="center">
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