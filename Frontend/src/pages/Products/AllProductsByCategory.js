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

function AllProductsByCategory() {
  const [products, setProducts] = useState([]);
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
  //   fetch categories from backend
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
            <a href={`/products/${category.id}`}>See more</a>
          </Typography>
          <Grid container spacing={2}>
            {products
              .filter((product) => product.category_id === category.id)
              .slice(0, 4) // Display only the first 4 products in each category
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
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
        </div>
      ))}
    </Container>
  );
}

export default AllProductsByCategory;
