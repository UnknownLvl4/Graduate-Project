import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Badge,
  Menu,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import customerService from "../../services/customerService";
import { useDiscounts } from "../../store/DiscountContext"; // Import the discount context

function CartMenu() {
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const cartRef = useRef(null);
  const { discounts } = useDiscounts(); // Use the discount context

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await customerService.queryCartItems(userId);
        setCartItems(response);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = (itemId) => {
    customerService
      .removeFromCart(itemId)
      .then(() => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      })
      .catch((error) => {
        console.error("Failed to remove item from cart:", error);
      });
  };

  return (
    <Box ref={cartRef} sx={{ marginRight: 2 }}>
      <IconButton
        color="inherit"
        aria-label="cart"
        onClick={(event) =>
          setCartAnchorEl(cartAnchorEl ? null : event.currentTarget)
        }>
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={cartAnchorEl}
        open={Boolean(cartAnchorEl)}
        onClose={() => setCartAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { width: "350px", maxWidth: "100%" },
        }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Giỏ hàng ({cartItems.length} sản phẩm)
          </Typography>
          {cartItems.map((item) => {
            const discount = discounts.find(
              (d) => d.product_id === item.product_id
            ); // Find the discount for the product

            const discountedPrice = discount
              ? parseFloat(
                  item.price * (1 - discount.value / 100)
                ).toLocaleString()
              : item.price.toLocaleString();

            return (
              <Card
                key={item.id}
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 0.5,
                  position: "relative",
                }}>
                {discount && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 0, 0, 0.8)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}>
                    {discount.value}% OFF
                  </Typography>
                )}
                {item.quantity} ×
                <CardMedia
                  sx={{ width: 80, height: 80, objectFit: "contain" }}
                  image={item.image}
                  alt={item.product_name}
                  component={RouterLink}
                  to={`/product/${item.product_id}`}
                  onClick={() => setCartAnchorEl(null)}
                />
                <CardContent sx={{ flex: 1, py: 1, pr: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{
                        maxWidth: "150px",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      component={RouterLink}
                      to={`/product/${item.product_id}`}
                      onClick={() => setCartAnchorEl(null)}>
                      {item.product_name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFromCart(item.id)}
                      sx={{ ml: 1, p: 0.5 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {discount && (
                      <>
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                          }}>
                          {discountedPrice} VND
                        </span>
                      </>
                    )}
                    {!discount && (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "bold",
                        }}>
                        {item.price.toLocaleString()} VND
                      </span>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
          <Button
            variant="contained"
            fullWidth
            component={RouterLink}
            to="/cart"
            onClick={() => setCartAnchorEl(null)}>
            Thanh toán
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}

export default CartMenu;
