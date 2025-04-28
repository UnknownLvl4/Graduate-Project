import React, { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  Popper,
  Paper,
  InputBase,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardMedia,
  CardContent,
  alpha,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  // Add refs for hover functionality
  const profileRef = useRef(null);
  const cartRef = useRef(null);
  const categoryRef = useRef(null);

  // Hover handlers for profile menu
  const handleProfileMouseEnter = (event) => {
    setAnchorEl(profileRef.current);
  };

  const handleProfileMouseLeave = () => {
    setAnchorEl(null);
  };

  // Hover handlers for cart menu
  const handleCartMouseEnter = (event) => {
    setCartAnchorEl(cartRef.current);
  };

  const handleCartMouseLeave = () => {
    setCartAnchorEl(null);
  };

  // Hover handlers for category menu
  const handleCategoryMouseEnter = (event) => {
    setCategoryMenuAnchor(categoryRef.current);
  };

  const handleCategoryMouseLeave = () => {
    setCategoryMenuAnchor(null);
  };

  // Mock search results (will be from API later)
  const mockProducts = [
    { id: 1, name: 'Gaming Laptop', price: 1299.99, category: 'Laptops' },
    { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories' },
    { id: 3, name: 'Mechanical Keyboard', price: 129.99, category: 'Accessories' },
    // Add more mock products
  ];

  // Categories data (will be fetched from backend later)
  const categories = [
    {
      id: 1,
      name: 'Laptop',
      subcategories: ['Gaming', 'Văn phòng', 'Học sinh - Sinh viên'],
      brands: ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'],
    },
    {
      id: 2,
      name: 'Điện thoại',
      subcategories: ['Điện thoại 5G', 'Phổ thông 4G', 'Điện thoại gập'],
      brands: ['Apple', 'Samsung', 'Xiaomi', 'OnePlus'],
    },
    {
      id: 3,
      name: 'Tai nghe',
      subcategories: ['Không dây', 'Gaming', 'Thể thao'],
      brands: ['Sony', 'Bose', 'JBL', 'Apple'],
    },
  ];

  // Mock cart items (will be from Redux later)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 199.99,
      image: 'https://via.placeholder.com/50x50',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Gaming Laptop',
      price: 1299.99,
      image: 'https://via.placeholder.com/50x50',
      quantity: 1,
    },
  ]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      // Filter mock products (will be API call later)
      const results = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleClickAway = () => {
    setSearchResults([]);
    setSearchQuery('');
    setIsSearchOpen(false);
  };
// eslint-disable-next-line
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
// eslint-disable-next-line
  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
  };
// eslint-disable-next-line
  const handleCartOpen = (event) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
    setCategoryMenuAnchor(null);
    setCartAnchorEl(null);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: 2,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              display: isSearchOpen ? { xs: 'none', md: 'block' } : 'block',
            }}
          >
            E-Commerce
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* Categories Mega Menu */}
            <Box
              ref={categoryRef}
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <Button
                color="inherit"
                endIcon={<ArrowDownIcon />}
              >
                Danh mục
              </Button>
              <Popper
                open={Boolean(categoryMenuAnchor)}
                anchorEl={categoryMenuAnchor}
                placement="bottom-start"
                style={{ zIndex: 1301 }}
              >
                <Paper sx={{ width: '800px', maxWidth: '100%' }}>
                  <Box p={2}>
                    <Grid container spacing={2}>
                      {categories.map((category) => (
                        <Grid item xs={4} key={category.id}>
                          <Typography variant="h6" gutterBottom>
                            {category.name}
                          </Typography>
                          <List dense>
                            {category.subcategories.map((sub) => (
                              <ListItem
                                button
                                key={sub}
                                component={RouterLink}
                                to={`/products?category=${category.name.toLowerCase()}&subcategory=${sub.toLowerCase()}`}
                                onClick={handleMenuClose}
                              >
                                <ListItemText primary={sub} />
                              </ListItem>
                            ))}
                          </List>
                          <Divider />
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ mt: 1 }}
                          >
                            Thương hiệu phổ biến
                          </Typography>
                          <List dense>
                            {category.brands.map((brand) => (
                              <ListItem
                                button
                                key={brand}
                                component={RouterLink}
                                to={`/products?brand=${brand.toLowerCase()}`}
                                onClick={handleMenuClose}
                              >
                                <ListItemText primary={brand} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Paper>
              </Popper>
            </Box>

            <Button color="inherit" component={RouterLink} to="/products">
              Sản phẩm
            </Button>

            <Button color="inherit" component={RouterLink} to="/contact">
              Liên hệ
            </Button>
          </Box>

          {/* Search Bar with Results */}
          <Box
            ref={searchRef}
            sx={{
              position: 'relative',
              flexGrow: isSearchOpen ? 1 : 0,
              display: { xs: isSearchOpen ? 'flex' : 'none', md: 'flex' },
              backgroundColor: (theme) =>
                isSearchOpen ? alpha(theme.palette.common.white, 0.15) : 'transparent',
              '&:hover': {
                backgroundColor: (theme) =>
                  isSearchOpen ? alpha(theme.palette.common.white, 0.25) : 'transparent',
              },
              borderRadius: 1,
              marginRight: 2,
            }}
          >
            {isSearchOpen && (
              <>
                <InputBase
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  sx={{
                    color: 'inherit',
                    padding: '4px 8px',
                    paddingLeft: '1rem',
                    flex: 1,
                  }}
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1300,
                      mt: 1,
                      maxHeight: '400px',
                      overflow: 'auto',
                    }}
                  >
                    <List>
                      {searchResults.map((product) => (
                        <ListItem
                          key={product.id}
                          component={RouterLink}
                          to={`/products/${product.id}`}
                          onClick={handleClickAway}
                          button
                        >
                          <ListItemText
                            primary={product.name}
                            secondary={`$${product.price} - ${product.category}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </>
            )}
            <IconButton color="inherit" onClick={toggleSearch}>
              {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          </Box>

          {/* Cart and Profile Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              ref={cartRef}
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <IconButton
                color="inherit"
                aria-label="cart"
              >
                <Badge badgeContent={cartItems.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={cartAnchorEl}
                open={Boolean(cartAnchorEl)}
                onClose={() => setCartAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: { width: '350px', maxWidth: '100%' },
                  onMouseEnter: handleCartMouseEnter,
                  onMouseLeave: handleCartMouseLeave,
                }}
              >
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    Shopping Cart ({cartItems.length} items)
                  </Typography>
                  {cartItems.map((item) => (
                    <Card key={item.id} sx={{ mb: 1, display: 'flex' }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 50, height: 50, objectFit: 'cover' }}
                        image={item.image}
                        alt={item.name}
                      />
                      <CardContent sx={{ flex: 1, py: 1, pr: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFromCart(item.id)}
                            sx={{ ml: 1, p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} × ${item.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">Total:</Typography>
                    <Typography variant="subtitle1">
                      ${cartTotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    component={RouterLink}
                    to="/cart"
                    onClick={() => setCartAnchorEl(null)}
                  >
                    View Cart
                  </Button>
                </Box>
              </Menu>
            </Box>

            <Box
              ref={profileRef}
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <IconButton color="inherit">
                <PersonIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  onMouseEnter: handleProfileMouseEnter,
                  onMouseLeave: handleProfileMouseLeave,
                }}
              >
                <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
                  Login
                </MenuItem>
                <MenuItem component={RouterLink} to="/register" onClick={handleMenuClose}>
                  Register
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Typography variant="subtitle1" fontWeight={600}>
                Danh mục
              </Typography>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                component={RouterLink}
                to={`/products?category=${category.name.toLowerCase()}`}
                onClick={handleMenuClose}
                sx={{ pl: 3 }}
              >
                {category.name}
              </MenuItem>
            ))}
            <MenuItem component={RouterLink} to="/products" onClick={handleMenuClose}>
              Sản phẩm
            </MenuItem>
            <MenuItem component={RouterLink} to="/contact" onClick={handleMenuClose}>
              Liên hệ
            </MenuItem>
            <MenuItem component={RouterLink} to="/cart" onClick={handleMenuClose}>
              Cart
            </MenuItem>
            <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
              Login
            </MenuItem>
            <MenuItem component={RouterLink} to="/register" onClick={handleMenuClose}>
              Register
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header; 