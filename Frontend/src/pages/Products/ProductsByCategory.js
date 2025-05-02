import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const mockProducts = [
  { id: 1, name: 'Product 1', category: 'Category 1', subcategory: 'Subcategory A', brand: 'Brand A', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', category: 'Category 1', subcategory: 'Subcategory B', brand: 'Brand B', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Product 3', category: 'Category 2', subcategory: 'Subcategory A', brand: 'Brand A', image: 'https://via.placeholder.com/150' },
];

function ProductsByCategory({ category }) {
  const subcategories = [...new Set(mockProducts.filter(product => product.category === category).map(product => product.subcategory))];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Products in {category}
      </Typography>
      {subcategories.map(subcategory => (
        <div key={subcategory}>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            {subcategory}
          </Typography>
          <Grid container spacing={2}>
            {mockProducts
              .filter(product => product.category === category && product.subcategory === subcategory)
              .map(product => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Brand: {product.brand}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </div>
      ))}
    </Container>
  );
}

export default ProductsByCategory;