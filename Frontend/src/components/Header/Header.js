import React, { useState } from 'react';
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
  Grow,
  ClickAwayListener,
  InputBase,
  Fade,
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
} from '@mui/icons-material';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);

  // Categories data (will be fetched from backend later)
  const categories = [
    {
      id: 1,
      name: 'Laptops',
      subcategories: ['Gaming', 'Business', 'Student'],
      brands: ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'],
    },
    {
      id: 2,
      name: 'Phones',
      subcategories: ['Smartphones', 'Basic Phones', 'Accessories'],
      brands: ['Apple', 'Samsung', 'Google', 'OnePlus'],
    },
    {
      id: 3,
      name: 'Headphones',
      subcategories: ['Wireless', 'Gaming', 'Sports'],
      brands: ['Sony', 'Bose', 'JBL', 'Apple'],
    },
  ];

  // Mock cart items (will be from Redux later)
  const cartItems = [
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
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

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
            <Button
              color="inherit"
              onClick={handleCategoryMenuOpen}
              endIcon={<ArrowDownIcon />}
            >
              Categories
            </Button>
            <Popper
              open={Boolean(categoryMenuAnchor)}
              anchorEl={categoryMenuAnchor}
              placement="bottom-start"
              transition
              disablePortal
              style={{ zIndex: 1301 }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper sx={{ width: '800px', maxWidth: '100%' }}>
                    <ClickAwayListener onClickAway={handleMenuClose}>
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
                                Popular Brands
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
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

            <Button color="inherit" component={RouterLink} to="/products">
              All Products
            </Button>
            <Button color="inherit" component={RouterLink} to="/deals">
              Deals
            </Button>
            <Button color="inherit" component={RouterLink} to="/contact">
              Contact
            </Button>
          </Box>

          {/* Search Bar */}
          <Box
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
              <InputBase
                placeholder="Search products..."
                sx={{
                  color: 'inherit',
                  padding: '4px 8px',
                  paddingLeft: '1rem',
                  flex: 1,
                }}
                autoFocus
              />
            )}
            <IconButton color="inherit" onClick={toggleSearch}>
              {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          </Box>

          {/* Cart and Profile Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleCartOpen}
              aria-label="cart"
            >
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Cart Preview Popup */}
            <Popper
              open={Boolean(cartAnchorEl)}
              anchorEl={cartAnchorEl}
              placement="bottom-end"
              transition
              disablePortal
              style={{ zIndex: 1301 }}
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps}>
                  <Paper sx={{ width: '350px', maxWidth: '100%' }}>
                    <Box p={2}>
                      <Typography variant="h6" gutterBottom>
                        Shopping Cart
                      </Typography>
                      {cartItems.map((item) => (
                        <Card key={item.id} sx={{ mb: 1, display: 'flex' }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 50, height: 50, objectFit: 'cover' }}
                            image={item.image}
                            alt={item.name}
                          />
                          <CardContent sx={{ flex: 1, py: 1 }}>
                            <Typography variant="subtitle2">{item.name}</Typography>
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
                        onClick={handleMenuClose}
                      >
                        View Cart
                      </Button>
                    </Box>
                  </Paper>
                </Fade>
              )}
            </Popper>

            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <PersonIcon />
            </IconButton>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
              My Profile
            </MenuItem>
            <MenuItem component={RouterLink} to="/orders" onClick={handleMenuClose}>
              My Orders
            </MenuItem>
            <MenuItem component={RouterLink} to="/wishlist" onClick={handleMenuClose}>
              Wishlist
            </MenuItem>
            <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
              Login
            </MenuItem>
            <MenuItem component={RouterLink} to="/register" onClick={handleMenuClose}>
              Register
            </MenuItem>
          </Menu>

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Typography variant="subtitle1" fontWeight={600}>
                Categories
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
              All Products
            </MenuItem>
            <MenuItem component={RouterLink} to="/deals" onClick={handleMenuClose}>
              Deals
            </MenuItem>
            <MenuItem component={RouterLink} to="/contact" onClick={handleMenuClose}>
              Contact
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