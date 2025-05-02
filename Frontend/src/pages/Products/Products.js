import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Select, MenuItem, FormControl, InputLabel, Pagination } from '@mui/material';

const mockProducts = [
  // Example product data
  { id: 1, name: 'Product 1', category: 'Category 1', subcategory: 'Subcategory A', brand: 'Brand X', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', category: 'Category 1', subcategory: 'Subcategory B', brand: 'Brand Y', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Product 3', category: 'Category 2', subcategory: 'Subcategory A', brand: 'Brand X', image: 'https://via.placeholder.com/150' },
  // Add more mock products as needed
];

function Products() {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [page, setPage] = useState(1);

  const categories = [...new Set(mockProducts.map(product => product.category))];
  const subcategories = [...new Set(mockProducts.map(product => product.subcategory))];
  const brands = [...new Set(mockProducts.map(product => product.brand))];

  const filteredProducts = mockProducts.filter(product => {
    return (
      (!category || product.category === category) &&
      (!subcategory || product.subcategory === subcategory) &&
      (!brand || product.brand === brand)
    );
  });

  const productsPerPage = 10;
  const paginatedProducts = filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSubcategory(''); // Reset subcategory when category changes
    setPage(1); // Reset to first page
  };

  const handleSubcategoryChange = (event) => {
    setSubcategory(event.target.value);
    setPage(1); // Reset to first page
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
    setPage(1); // Reset to first page
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Products
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={handleCategoryChange}>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Subcategory</InputLabel>
            <Select value={subcategory} onChange={handleSubcategoryChange} disabled={!category}>
              <MenuItem value="">All Subcategories</MenuItem>
              {subcategories
                .filter(subcat => !category || mockProducts.some(product => product.category === category && product.subcategory === subcat))
                .map(subcat => (
                  <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select value={brand} onChange={handleBrandChange}>
              <MenuItem value="">All Brands</MenuItem>
              {brands.map(br => (
                <MenuItem key={br} value={br}>{br}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Products Section */}
      <Grid container spacing={2}>
        {paginatedProducts.map(product => (
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
                  {product.category} - {product.subcategory} - {product.brand}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Grid>
    </Container>
  );
}

export default Products;