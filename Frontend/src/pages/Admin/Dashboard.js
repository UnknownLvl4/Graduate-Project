import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  CircularProgress,
  TablePagination,
  Checkbox,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as adminService from "../../services/adminService";
import OrdersSection from "../../components/Admin/OrdersSection";
import DiscountSection from "../../components/Admin/DiscountSection";
import StatisticSection from "../../components/Admin/StatisticSection"; // Import the new component

// TabPanel component for different sections
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("sản phẩm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      switch (tab) {
        case 0:
          const response = await adminService.getProducts(
            page + 1,
            rowsPerPage,
            searchQuery.trim().toLowerCase()
          );
          data = response.data.items;
          setTotalItems(response.data.meta.total);
          break;
        case 1:
          const ordersResponse = await adminService.getOrders();
          data = ordersResponse.data || [];
          break;
        case 2:
          const usersResponse = await adminService.getUsers();
          data = usersResponse.data || [];
          break;
        default:
          data = [];
      }
      setItems(data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [tab, page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [tab, page, rowsPerPage, fetchData]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setDialogType(
      newValue === 0 ? "sản phẩm" : newValue === 1 ? "order" : "user"
    );
    setPage(0);
  };

  const handleOpenDialog = (item = null) => {
    setSelectedItem(
      item
        ? { ...item }
        : {
            category_id: "",
            product_id: "",
            product_name: "",
            description: "",
            price: "",
            stock_quantity: "",
            image: "",
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setOpenDialog(false);
    setError(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    setError(null);

    // Validate required fields
    if (
      !selectedItem.category_id ||
      !selectedItem.sub_category_id ||
      !selectedItem.product_id ||
      !selectedItem.product_name ||
      !selectedItem.price ||
      !selectedItem.stock_quantity
    ) {
      setError("Vui lòng điền vào tất cả các trường được yêu cầu");
      setLoading(false);
      return;
    }

    try {
      const productData = {
        category_id: selectedItem.category_id,
        sub_category_id: selectedItem.sub_category_id,
        product_id: selectedItem.product_id,
        product_name: selectedItem.product_name,
        description: selectedItem.description || "",
        stock_quantity: parseInt(selectedItem.stock_quantity),
        price: parseFloat(selectedItem.price),
        image: selectedItem.image || "",
      };

      console.log(selectedItem.image);

      // Validation
      if (!selectedItem.category_id.match(/^[A-Z]+$/)) {
        throw new Error("Mã danh mục chỉ được chứa chữ in hoa");
      }

      // Validate product_id length
      if (selectedItem.product_id.length > 10) {
        throw new Error("Mã sản phẩm không được vượt quá 10 ký tự");
      }

      if (selectedItem.price < 0) {
        throw new Error("Giá tiền không được âm");
      }

      if (selectedItem.stock_quantity < 0) {
        throw new Error("Số hàng trong kho không được âm");
      }

      if (
        !selectedItem.product_name ||
        selectedItem.product_name.trim() === ""
      ) {
        throw new Error("Product name is required");
      }

      // If product exists in items array, it's an update
      const isUpdate = items.some(
        (item) =>
          item.category_id === selectedItem.category_id &&
          item.product_id === selectedItem.product_id
      );

      if (isUpdate) {
        await adminService.updateProduct(
          selectedItem.category_id,
          selectedItem.product_id,
          productData
        );
      } else {
        await adminService.createProduct(productData);
      }

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || "Failed to save");
      console.error("Error saving product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = items.map(
        (item) => `${item.category_id}-${item.product_id}`
      );
      setSelectedProducts(newSelected);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (event, id) => {
    const selectedIndex = selectedProducts.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedProducts, id];
    } else {
      newSelected = selectedProducts.filter((itemId) => itemId !== id);
    }

    setSelectedProducts(newSelected);
  };

  const isSelected = (id) => selectedProducts.indexOf(id) !== -1;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        const updatedFile = new File([buffer], file.name, { type: file.type });
        console.log(updatedFile);

        setSelectedItem((prev) => ({
          ...prev,
          image: updatedFile, // Inject into file object
        }));
      };
      reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    }
  };

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (item.product_id)
      return (
        item.product_id.toLowerCase().includes(query) ||
        item.product_name.toLowerCase().includes(query)
      );
    else return item;
  });

  // Render functions for different sections
  const renderProductsSection = () => (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant="h6">Sản phẩm</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}>
          Thêm sản phẩm
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Tìm kiếm sản phẩm theo tên hoặc mã sản phẩm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: "background.paper" }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : filteredItems.length === 0 ? (
        <Alert severity="info">Không sản phẩm nào được tìm thấy</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      items.length > 0 &&
                      selectedProducts.length === items.length
                    }
                    onChange={handleSelectAll}
                    indeterminate={
                      selectedProducts.length > 0 &&
                      selectedProducts.length < items.length
                    }
                  />
                </TableCell>
                <TableCell>Mã danh mục</TableCell>
                <TableCell>Mã sản phẩm</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Giá tiền</TableCell>
                <TableCell>Số lượng trong kho</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => {
                const isItemSelected = isSelected(
                  `${item.category_id}-${item.product_id}`
                );
                return (
                  <TableRow
                    key={`${item.category_id}-${item.product_id}`}
                    selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) =>
                          handleSelectProduct(
                            event,
                            `${item.category_id}-${item.product_id}`
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{item.category_id}</TableCell>
                    <TableCell>{item.product_id}</TableCell>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>
                      {parseInt(item.price).toLocaleString()} VND
                    </TableCell>
                    <TableCell>{item.stock_quantity}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          navigate(
                            `/admin/products/${item.category_id}/${item.product_id}`
                          )
                        }
                        disabled={loading}
                        title="Xem chi tiết">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDialog(item)}
                        disabled={loading}
                        title="Chinh sửa">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          {selectedItem ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="category_id"
              label="Mã danh mục"
              value={selectedItem?.category_id || ""}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.category_id}
              helperText={
                error && !selectedItem?.category_id
                  ? "Mã danh mục bắt buộc phải có"
                  : ""
              }
            />
            <TextField
              name="product_id"
              label="Mã sản phẩm"
              value={selectedItem?.product_id || ""}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.product_id}
              helperText={
                error && !selectedItem?.product_id
                  ? "Mã sản phẩm bắt buộc phải có"
                  : ""
              }
            />
            <TextField
              name="product_name"
              label="Tên sản phẩm"
              value={selectedItem?.product_name || ""}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.product_name}
              helperText={
                error && !selectedItem?.product_name
                  ? "Tên sản phẩm bắt buộc phải có"
                  : ""
              }
            />
            <TextField
              name="description"
              label="Mô tả"
              value={selectedItem?.description || ""}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              name="price"
              label="Giá"
              type="number"
              value={selectedItem?.price || ""}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{
                startAdornment: <span>VND</span>,
              }}
              error={error && !selectedItem?.price}
              helperText={
                error && !selectedItem?.price ? "Giá tiền bắt buộc phải có" : ""
              }
            />
            <TextField
              name="stock_quantity"
              label="Số lượng hàng trong kho"
              type="number"
              value={selectedItem?.stock_quantity || ""}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.stock_quantity}
              helperText={
                error && !selectedItem?.stock_quantity
                  ? "Số lượng hàng trong kho bắt buộc phải có"
                  : ""
              }
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-file">
                <Button variant="contained" component="span">
                  Chọn ảnh
                </Button>
              </label>
              {selectedItem?.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={selectedItem.image || ""}
                    alt="Xem trước"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderOrdersSection = () => (
    <OrdersSection items={items} fetchData={fetchData} />
  );

  const renderUsersSection = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "ADMIN" : "CUSTOMER"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleSaveUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = {
        firstName: selectedItem.firstName,
        lastName: selectedItem.lastName,
        email: selectedItem.email,
        isAdmin: selectedItem.isAdmin,
      };
      // Validation
      if (!selectedItem.firstName || !selectedItem.lastName) {
        throw new Error("First and last name are required");
      }
      if (!selectedItem.email) {
        throw new Error("Email is required");
      }
      if (!selectedItem.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Invalid email format");
      }
      if (selectedItem.isAdmin === undefined) {
        throw new Error("Role is required");
      }
      // save user
      if (selectedItem.id)
        await adminService.updateUser(selectedItem.id, userData);
    } catch (err) {
      setError(err.message || "Failed to save user");
      console.error("Error saving user:", err);
    } finally {
      setLoading(false);
      handleCloseDialog();
      fetchData();
    }
  };

  const renderDialog = () => (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>
        {selectedItem?.product_id || selectedItem?.id
          ? `Chỉnh sửa ${dialogType}`
          : `Thêm ${dialogType}`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {dialogType === "sản phẩm" && (
            <>
              <TextField
                name="product_id"
                label="Mã sản phẩm"
                value={selectedItem?.product_id || ""}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={!!selectedItem?.product_id}
                error={error && !selectedItem?.product_id}
                helperText={
                  error && !selectedItem?.product_id
                    ? "Mã sản phẩm bắt buộc phải có"
                    : ""
                }
              />
              <TextField
                name="category_id"
                label="Mã danh mục"
                value={selectedItem?.category_id || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.category_id}
                helperText={
                  error && !selectedItem?.category_id
                    ? "Mã danh mục bắt buộc phải có"
                    : ""
                }
              />
              <TextField
                name="sub_category_id"
                label="Mã danh mục phụ"
                value={selectedItem?.sub_category_id || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.sub_category_id}
                helperText={
                  error && !selectedItem?.sub_category_id
                    ? "Mã danh mục phụ bắt buộc phải có"
                    : ""
                }
              />
              <TextField
                name="product_name"
                label="Tên sản phẩm"
                value={selectedItem?.product_name || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.product_name}
                helperText={
                  error && !selectedItem?.product_name
                    ? "Tên sản phẩm bắt buộc phải có"
                    : ""
                }
              />
              <TextField
                name="description"
                label="Mô tả"
                value={selectedItem?.description || ""}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                name="price"
                label="Giá"
                type="number"
                value={selectedItem?.price || ""}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <span>VND</span>,
                }}
                error={error && !selectedItem?.price}
                helperText={
                  error && !selectedItem?.price
                    ? "Giá tiền bắt buộc phải có"
                    : ""
                }
              />
              <TextField
                name="stock_quantity"
                label="Số lượng hàng trong kho"
                type="number"
                value={selectedItem?.stock_quantity || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.stock_quantity}
                helperText={
                  error && !selectedItem?.stock_quantity
                    ? "Số lượng hàng trong kho bắt buộc phải có"
                    : ""
                }
              />
              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-file">
                  <Button variant="contained" component="span">
                    Chọn ảnh
                  </Button>
                </label>
                {selectedItem?.image && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={selectedItem.image || ""}
                      alt="Xem trước"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </Box>
                )}
              </Box>
            </>
          )}
          {dialogType === "user" && (
            <>
              <TextField
                name="firstName"
                label="Tên"
                value={selectedItem?.firstName || ""}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="lastName"
                label="Họ và tên đệm"
                value={selectedItem?.lastName || ""}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={selectedItem?.email || ""}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="isAdmin"
                label="Vai trò"
                select
                value={selectedItem?.isAdmin || false}
                onChange={handleInputChange}
                fullWidth
                required>
                <MenuItem value={true}>Admin</MenuItem>
                <MenuItem value={false}>Khách hàng</MenuItem>
              </TextField>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={
            dialogType === "sản phẩm" ? handleSaveProduct : handleSaveUser
          }
          variant="contained"
          disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDiscountSection = () => (
    <DiscountSection items={items} fetchData={fetchData} />
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography
              component="h1"
              variant="h4"
              color="primary"
              gutterBottom>
              Trang Admin
            </Typography>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: "100%" }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary">
              <Tab label="Sản phẩm" />
              <Tab label="Đơn hàng" />
              <Tab label="Người dùng" />
              <Tab label="Giảm giá" />
              <Tab label="Thống kê" />
            </Tabs>

            <TabPanel value={tab} index={0}>
              {renderProductsSection()}
            </TabPanel>
            <TabPanel value={tab} index={1}>
              {renderOrdersSection()}
            </TabPanel>
            <TabPanel value={tab} index={2}>
              {renderUsersSection()}
            </TabPanel>
            <TabPanel value={tab} index={3}>
              {renderDiscountSection()}
            </TabPanel>
            <TabPanel value={tab} index={4}>
              <StatisticSection />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Modals */}
      {renderDialog()}
    </Container>
  );
}

export default Dashboard;
