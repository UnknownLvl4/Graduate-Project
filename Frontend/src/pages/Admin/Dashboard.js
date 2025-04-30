import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as adminService from '../../services/adminService';

// TabPanel component for different sections
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('product');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      switch (tab) {
        case 0:
          const response = await adminService.getProducts(page + 1, rowsPerPage);
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
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [tab, page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [tab, page, rowsPerPage, fetchData]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setDialogType(newValue === 0 ? 'product' : newValue === 1 ? 'order' : 'user');
    setPage(0);
  };

  const handleOpenDialog = (item = null) => {
    setSelectedItem(item ? { ...item } : {
      category_id: '',
      product_id: '',
      product_name: '',
      description: '',
      price: '',
      stock_quantity: '',
      image: ''
    });
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

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!selectedItem.category_id || !selectedItem.product_id || 
        !selectedItem.product_name || !selectedItem.price || 
        !selectedItem.stock_quantity) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        category_id: selectedItem.category_id,
        product_id: selectedItem.product_id,
        product_name: selectedItem.product_name,
        description: selectedItem.description || '',
        stock_quantity: parseInt(selectedItem.stock_quantity),
        price: parseFloat(selectedItem.price),
        image: selectedItem.image || ''
      };

      // Validation
      if (!selectedItem.category_id.match(/^[A-Z]+$/)) {
        throw new Error('Category ID must contain only uppercase letters');
      }

      // Validate product_id length
      if (selectedItem.product_id.length > 10) {
        throw new Error('Product ID must not exceed 10 characters');
      }

      if (selectedItem.price < 0) {
        throw new Error('Price cannot be negative');
      }

      if (selectedItem.stock_quantity < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      if (!selectedItem.product_name || selectedItem.product_name.trim() === '') {
        throw new Error('Product name is required');
      }

      // If product exists in items array, it's an update
      const isUpdate = items.some(
        item => item.category_id === selectedItem.category_id && 
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
      setError(err.message || 'Failed to save');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    setError(null);
    try {
      switch (dialogType) {
        case 'product':
          await adminService.deleteProduct(itemToDelete.category_id, itemToDelete.product_id);
          break;
        case 'user':
          await adminService.deleteUser(itemToDelete.id);
          break;
        default:
          throw new Error('Invalid operation');
      }
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete');
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewProduct = (item) => {
    navigate(`/products/${item.category_id}/${item.product_id}`);
  };

  const handleViewDetail = (item) => {
    window.open(`/products/${item.category_id}/${item.product_id}`, '_blank');
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = items.map(item => `${item.category_id}-${item.product_id}`);
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
      newSelected = selectedProducts.filter(itemId => itemId !== id);
    }

    setSelectedProducts(newSelected);
  };

  const isSelected = (id) => selectedProducts.indexOf(id) !== -1;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      setSelectedItem(prev => ({
        ...prev,
        image: URL.createObjectURL(file)
      }));
    }
  };

  // Render functions for different sections
  const renderProductsSection = () => (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Alert severity="info">No products found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={items.length > 0 && selectedProducts.length === items.length}
                    onChange={handleSelectAll}
                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < items.length}
                  />
                </TableCell>
                <TableCell>Category ID</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isItemSelected = isSelected(`${item.category_id}-${item.product_id}`);
                return (
                  <TableRow 
                    key={`${item.category_id}-${item.product_id}`}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleSelectProduct(event, `${item.category_id}-${item.product_id}`)}
                      />
                    </TableCell>
                    <TableCell>{item.category_id}</TableCell>
                    <TableCell>{item.product_id}</TableCell>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.stock_quantity}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => navigate(`/admin/products/${item.category_id}/${item.product_id}`)} 
                        disabled={loading}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleOpenDialog(item)} 
                        disabled={loading}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteClick(item)} 
                        disabled={loading}
                        title="Delete"
                      >
                        <DeleteIcon />
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedItem ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="category_id"
              label="Category ID"
              value={selectedItem?.category_id || ''}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.category_id}
              helperText={error && !selectedItem?.category_id ? 'Category ID is required' : ''}
            />
            <TextField
              name="product_id"
              label="Product ID"
              value={selectedItem?.product_id || ''}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.product_id}
              helperText={error && !selectedItem?.product_id ? 'Product ID is required' : ''}
            />
            <TextField
              name="product_name"
              label="Product Name"
              value={selectedItem?.product_name || ''}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.product_name}
              helperText={error && !selectedItem?.product_name ? 'Product name is required' : ''}
            />
            <TextField
              name="description"
              label="Description"
              value={selectedItem?.description || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={selectedItem?.price || ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{
                startAdornment: <span>$</span>,
              }}
              error={error && !selectedItem?.price}
              helperText={error && !selectedItem?.price ? 'Price is required' : ''}
            />
            <TextField
              name="stock_quantity"
              label="Stock"
              type="number"
              value={selectedItem?.stock_quantity || ''}
              onChange={handleInputChange}
              fullWidth
              required
              error={error && !selectedItem?.stock_quantity}
              helperText={error && !selectedItem?.stock_quantity ? 'Stock is required' : ''}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-file">
                <Button variant="contained" component="span">
                  Choose Image
                </Button>
              </label>
              {selectedItem?.image && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    src={selectedItem.image} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderOrdersSection = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.customer}</TableCell>
              <TableCell>${item.total}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
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
  );

  const renderUsersSection = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.role}</TableCell>
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
  );

  const renderDialog = () => (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedItem ? `Edit ${dialogType}` : `Add ${dialogType}`}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dialogType === 'product' && (
            <>
              <TextField
                name="category_id"
                label="Category ID"
                value={selectedItem?.category_id || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.category_id}
                helperText={error && !selectedItem?.category_id ? 'Category ID is required' : ''}
              />
              <TextField
                name="product_id"
                label="Product ID"
                value={selectedItem?.product_id || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.product_id}
                helperText={error && !selectedItem?.product_id ? 'Product ID is required' : ''}
              />
              <TextField
                name="product_name"
                label="Product Name"
                value={selectedItem?.product_name || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.product_name}
                helperText={error && !selectedItem?.product_name ? 'Product Name is required' : ''}
              />
              <TextField
                name="description"
                label="Description"
                value={selectedItem?.description || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                value={selectedItem?.price || ''}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
                error={error && !selectedItem?.price}
                helperText={error && !selectedItem?.price ? 'Price is required' : ''}
              />
              <TextField
                name="stock_quantity"
                label="Stock"
                type="number"
                value={selectedItem?.stock_quantity || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.stock_quantity}
                helperText={error && !selectedItem?.stock_quantity ? 'Stock is required' : ''}
              />
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-file">
                  <Button variant="contained" component="span">
                    Choose Image
                  </Button>
                </label>
                {selectedItem?.image && (
                  <Box sx={{ mt: 2 }}>
                    <img 
                      src={selectedItem.image} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px' }} 
                    />
                  </Box>
                )}
              </Box>
            </>
          )}
          {dialogType === 'order' && (
            <TextField
              name="status"
              label="Status"
              select
              value={selectedItem?.status || ''}
              onChange={handleInputChange}
              fullWidth
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          )}
          {dialogType === 'user' && (
            <>
              <TextField
                name="name"
                label="Name"
                value={selectedItem?.name || ''}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={selectedItem?.email || ''}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="role"
                label="Role"
                select
                value={selectedItem?.role || ''}
                onChange={handleInputChange}
                fullWidth
                required
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </TextField>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Delete confirmation dialog
  const renderDeleteDialog = () => (
    <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>Are you sure you want to delete this {dialogType}?</DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h4" color="primary" gutterBottom>
              Admin Dashboard
            </Typography>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Sản phẩm" />
              <Tab label="Đơn hàng" />
              <Tab label="Người dùng" />
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
          </Paper>
        </Grid>
      </Grid>

      {/* Modals */}
      {renderDialog()}
      {renderDeleteDialog()}
    </Container>
  );
}

export default Dashboard;