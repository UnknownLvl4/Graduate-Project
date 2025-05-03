import React, { useState, useRef, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Popper,
  Paper,
  InputBase,
  Grid,
  List,
  ListItem,
  ListItemText,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import customerService from "../../services/customerService";
import CartMenu from "../Cart/CartMenu";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const categoryRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token && !!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await customerService.queryProducts({
          page: 1,
          limit: 1000,
        });
        setProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await customerService.queryCategories();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await customerService.querySubCategories();
        setSubCategories(response);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const results = products.filter((product) =>
        product.product_name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleClickAway = () => {
    setSearchResults([]);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
    setCategoryMenuAnchor(null);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={handleMobileMenuOpen}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: 2,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 700,
              display: isSearchOpen ? { xs: "none", md: "block" } : "block",
            }}>
            E-Commerce
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Box ref={categoryRef}>
              <Button
                color="inherit"
                endIcon={<ArrowDownIcon />}
                onClick={(event) =>
                  setCategoryMenuAnchor(
                    categoryMenuAnchor ? null : event.currentTarget
                  )
                }>
                Danh mục
              </Button>
              <Popper
                open={Boolean(categoryMenuAnchor)}
                anchorEl={categoryMenuAnchor}
                placement="bottom-start"
                style={{ zIndex: 1301 }}>
                <Paper sx={{ width: "800px", maxWidth: "100%" }}>
                  <Box p={2}>
                    <Grid container spacing={2}>
                      {categories.map((category) => (
                        <Grid item xs={4} key={category.id}>
                          <Button
                            variant="text"
                            fullWidth
                            component={RouterLink}
                            to={`/products/${category.id}`}
                            onClick={handleMenuClose}
                            sx={{
                              justifyContent: "flex-start",
                              textTransform: "none",
                              fontWeight: "bold",
                              fontSize: "1.5rem",
                            }}>
                            {category.name}
                          </Button>
                          <List dense>
                            {subCategories
                              .filter((s) => s.category_id === category.id)
                              .map((sub) => (
                                <ListItem
                                  button
                                  key={sub.id}
                                  component={RouterLink}
                                  to={`/products/${category.id}/${sub.id}`}
                                  onClick={handleMenuClose}>
                                  <ListItemText primary={sub.name} />
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

          <Box
            ref={searchRef}
            sx={{
              position: "relative",
              flexGrow: isSearchOpen ? 1 : 0,
              display: { xs: isSearchOpen ? "flex" : "none", md: "flex" },
              backgroundColor: (theme) =>
                isSearchOpen
                  ? alpha(theme.palette.common.white, 0.15)
                  : "transparent",
              "&:hover": {
                backgroundColor: (theme) =>
                  isSearchOpen
                    ? alpha(theme.palette.common.white, 0.25)
                    : "transparent",
              },
              borderRadius: 1,
              marginRight: 2,
            }}>
            {isSearchOpen && (
              <>
                <InputBase
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  sx={{
                    color: "inherit",
                    padding: "4px 8px",
                    paddingLeft: "1rem",
                    flex: 1,
                  }}
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <Paper
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1300,
                      mt: 1,
                      maxHeight: "400px",
                      overflow: "auto",
                    }}>
                    <List>
                      {searchResults.map((product) => (
                        <ListItem
                          key={product.product_id}
                          component={RouterLink}
                          to={`/product/${product.product_id}`}
                          onClick={handleClickAway}
                          button>
                          <ListItemText
                            primaryTypographyProps={{
                              noWrap: true,
                            }}
                            primary={product.product_name}
                            secondary={`${product.price} VND`}
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

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CartMenu />
            <Box ref={profileRef}>
              <IconButton
                color="inherit"
                onClick={(event) =>
                  setAnchorEl(anchorEl ? null : event.currentTarget)
                }>
                <PersonIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                {isLoggedIn ? (
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                ) : (
                  <>
                    <MenuItem
                      component={RouterLink}
                      to="/login"
                      onClick={handleMenuClose}>
                      Login
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/register"
                      onClick={handleMenuClose}>
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          </Box>

          <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
              <Typography variant="subtitle1" fontWeight={600}>
                Danh mục
              </Typography>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                component={RouterLink}
                to={`/products/${category.id}`}
                onClick={handleMenuClose}
                sx={{ pl: 3 }}>
                {category.name}
              </MenuItem>
            ))}
            <MenuItem
              component={RouterLink}
              to="/products"
              onClick={handleMenuClose}>
              Sản phẩm
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/contact"
              onClick={handleMenuClose}>
              Liên hệ
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/cart"
              onClick={handleMenuClose}>
              Cart
            </MenuItem>
            {isLoggedIn ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              <>
                <MenuItem
                  component={RouterLink}
                  to="/login"
                  onClick={handleMenuClose}>
                  Login
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/register"
                  onClick={handleMenuClose}>
                  Register
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
