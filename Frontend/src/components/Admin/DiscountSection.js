import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Alert,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import * as adminService from "../../services/adminService";

const DiscountSection = () => {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await adminService.getProducts(1, 1000); // Fetch all products
      setProducts(response.data.items || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await adminService.getDiscounts(); // Fetch all discounts
      setDiscounts(response.data || []);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDiscounts();
  }, []);

  const handleOpenDialog = (discount = null) => {
    setSelectedDiscount(
      discount || {
        product_id: "",
        value: 0,
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedDiscount(null);
    setOpenDialog(false);
    setError(null);
  };

  const handleOpenModal = (id) => {
    setDiscountToDelete(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setDiscountToDelete(null);
    setOpenModal(false);
  };

  const handleSaveDiscount = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!selectedDiscount.product_id || !selectedDiscount.value) {
        throw new Error("Product and discount value are required");
      }

      if (selectedDiscount.value <= 0 || selectedDiscount.value > 100) {
        throw new Error("Discount value must be between 1 and 100");
      }

      if (selectedDiscount.id) {
        // Update existing discount
        await adminService.updateDiscount(selectedDiscount.id, {
          product_id: selectedDiscount.product_id,
          value: selectedDiscount.value * 1,
        });
      } else {
        // Create new discount
        await adminService.createDiscount({
          product_id: selectedDiscount.product_id,
          value: selectedDiscount.value * 1,
        });
      }

      await fetchDiscounts();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Failed to save discount");
      console.error("Error saving discount:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminService.deleteDiscount(discountToDelete);
      await fetchDiscounts();
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Failed to delete discount");
      console.error("Error deleting discount:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedDiscount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{ m: 2 }}>
          Thêm giảm giá
        </Button>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Giá trị giảm giá (%)</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discounts.map((discount) => {
              const product = products.find(
                (product) => product.product_id === discount.product_id
              );
              return (
                <TableRow key={discount.id}>
                  <TableCell>
                    {product?.product_name || "Unknown Product"}
                  </TableCell>
                  <TableCell>{discount.value}%</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(discount)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(discount.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Discount Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          {selectedDiscount?.id ? "Chỉnh sửa giảm giá" : "Thêm giảm giá"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="product_id"
            label="Sản phẩm"
            select
            value={selectedDiscount?.product_id || ""}
            onChange={handleInputChange}
            fullWidth
            required>
            {products.map((product) => (
              <MenuItem key={product.product_id} value={product.product_id}>
                {product.product_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="value"
            label="Giá trị giảm giá (%)"
            type="number"
            value={selectedDiscount?.value || 0}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleSaveDiscount}
            variant="contained"
            disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Xác nhận xóa
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
          Bạn có chắc chắn muốn xóa giảm giá này không?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
              Hủy
            </Button>
            <Button
              onClick={handleDeleteDiscount}
              variant="contained"
              color="error"
              disabled={loading}>
              {loading ? "Đang xóa..." : "Xóa"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DiscountSection;
