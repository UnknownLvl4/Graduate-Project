import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import * as adminService from '../../services/adminService';

// TabPanel component for different sections
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      switch (tab) {
        case 0:
          data = await adminService.getProducts();
          break;
        case 1:
          data = await adminService.getOrders();
          break;
        case 2:
          data = await adminService.getUsers();
          break;
        default:
          data = [];
      }
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setDialogType(newValue === 0 ? 'product' : newValue === 1 ? 'order' : 'user');
  };

  const handleOpenDialog = (item = null) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setOpenDialog(false);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!selectedItem) {
        // Create new item
        switch (dialogType) {
          case 'product':
            await adminService.createProduct(selectedItem);
            break;
          default:
            throw new Error('Invalid operation');
        }
      } else {
        // Update existing item
        switch (dialogType) {
          case 'product':
            await adminService.updateProduct(selectedItem.id, selectedItem);
            break;
          case 'order':
            await adminService.updateOrder(selectedItem.id, selectedItem);
            break;
          case 'user':
            await adminService.updateUser(selectedItem.id, selectedItem);
            break;
          default:
            throw new Error('Invalid operation');
        }
      }
      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to save');
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
          await adminService.deleteProduct(itemToDelete.id);
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
    setSelectedItem(prev => ({
      ...prev,
      [name]: value
    }));
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
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleOpenDialog(item)}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(item)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
              <TableCell>{item.date}</TableCell>
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
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
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
      <DialogTitle>
        {selectedItem ? `Edit ${dialogType}` : `Add ${dialogType}`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dialogType === 'product' && (
            <>
              <TextField
                name="name"
                label="Product Name"
                value={selectedItem?.name || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.name}
                helperText={error && !selectedItem?.name ? 'Name is required' : ''}
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
                  startAdornment: <span>$</span>
                }}
                error={error && !selectedItem?.price}
                helperText={error && !selectedItem?.price ? 'Price is required' : ''}
              />
              <TextField
                name="category"
                label="Category"
                value={selectedItem?.category || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.category}
                helperText={error && !selectedItem?.category ? 'Category is required' : ''}
              />
              <TextField
                name="stock"
                label="Stock"
                type="number"
                value={selectedItem?.stock || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={error && !selectedItem?.stock}
                helperText={error && !selectedItem?.stock ? 'Stock is required' : ''}
              />
            </>
          )}
          {dialogType === 'order' && (
            <>
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
            </>
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
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
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
              <Tab label="Products" />
              <Tab label="Orders" />
              <Tab label="Users" />
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {dialogType}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit dialog */}
      {renderDialog()}
    </Container>
  );
}

export default Dashboard;