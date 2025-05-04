import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import * as adminService from "../../services/adminService";

function ProductDetail() {
  const { category_id, product_id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminService.getProduct(category_id, product_id);
        setProduct(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [category_id, product_id]);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : product ? (
          <Box>
            <Typography variant="h4" gutterBottom>
              Chi tiết sản phẩm
            </Typography>
            <Typography variant="h6">Mã danh mục:</Typography>
            <Typography>{product.category_id}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Mã sản phẩm:
            </Typography>
            <Typography>{product.product_id}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Tên sản phẩm:
            </Typography>
            <Typography>{product.product_name}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Mô tả:
            </Typography>
            <Typography>
              {product.description || "No description available"}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Giá tiền sản phẩm:
            </Typography>
            <Typography>{product.price.toLocaleString()} VND</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Số lượng trong kho:
            </Typography>
            <Typography>{product.stock_quantity}</Typography>
            {product.image && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Hình ảnh:</Typography>
                <img
                  src={product.image}
                  alt={product.product_name}
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
              </Box>
            )}
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={handleBack}>
                Quay về
              </Button>
            </Box>
          </Box>
        ) : (
          <Alert severity="info">
            Không có chi tiết sản phẩm nào được tìm thấy
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default ProductDetail;
