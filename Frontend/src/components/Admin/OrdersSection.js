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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import * as adminService from "../../services/adminService";

const OrdersSection = ({ items, fetchData }) => {
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchUsers = async () => {
    try {
      const usersResponse = await adminService.getUsers();
      setUsers(usersResponse.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOpenDialog(false);
    setError(null);
  };

  const handleSaveOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!selectedOrder.status) {
        throw new Error("Status is required");
      }

      await adminService.updateOrder(selectedOrder.id, {
        status: selectedOrder.status,
      });

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Failed to save order");
      console.error("Error saving order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter orders based on the selected date
  const filteredItems = selectedDate
    ? items.filter(
        (item) =>
          new Date(item.created_at).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      )
    : items;

  return (
    <>
      {/* Date Picker for filtering */}
      <div style={{ marginBottom: "16px" }}>
        <TextField
          type="date"
          label="Lọc theo ngày"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Người dùng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {(() => {
                    const user = users.find((user) => user.id === item.user_id);
                    return user
                      ? `${user.firstName} ${user.lastName}`
                      : "Unknown User";
                  })()}
                </TableCell>
                <TableCell>
                  {parseInt(item.total).toLocaleString()} VND
                </TableCell>
                <TableCell>
                  {(() => {
                    switch (item.status) {
                      case "Pending":
                        return "Chờ xác nhận";
                      case "Processing":
                        return "Đang xử lý";
                      case "Shipped":
                        return "Đang vận chuyển";
                      case "Delivered":
                        return "Đã vận chuyển";
                      case "Cancelled":
                        return "Hủy đơn";
                      default:
                        return "Không xác định";
                    }
                  })()}
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(item)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
        <DialogContent>
          <TextField
            name="status"
            label="Trạng thái"
            select
            value={selectedOrder?.status || ""}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!error}
            helperText={error}>
            <MenuItem value="Pending">Chờ xác nhận</MenuItem>
            <MenuItem value="Processing">Đang xử lý</MenuItem>
            <MenuItem value="Shipped">Đang vận chuyển</MenuItem>
            <MenuItem value="Delivered">Đã vận chuyển</MenuItem>
            <MenuItem value="Cancelled">Hủy đơn</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleSaveOrder}
            variant="contained"
            disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrdersSection;
