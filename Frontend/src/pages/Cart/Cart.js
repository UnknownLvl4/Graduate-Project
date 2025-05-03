import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart items and calculate total price with discounts
    const fetchCartItems = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const items = await customerService.queryCartItems(userId);
        const discounts = await customerService.getDiscounts();

        console.log("Fetched items:", items);
        console.log("Fetched discounts:", discounts);

        const updatedItems = items.map((item) => {
          const discount =
            discounts.find((d) => d.product_id === item.product_id)?.value || 0;
          const discountedPrice = parseInt(
            (item.price * (100 - discount)) / 100
          );
          return { ...item, discountedPrice };
        });

        setCartItems(updatedItems);

        const total = updatedItems.reduce(
          (sum, item) => sum + item.discountedPrice * item.quantity,
          0
        );
        setTotalPrice(total);
      } catch (error) {
        console.error("Error fetching cart items or discounts:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const billData = {
        user_id: JSON.parse(localStorage.getItem("user")).id,
      };

      const bill = await customerService.createBill(billData);

      if (paymentMethod === "banking") {
        alert("Order placed successfully!");
        window.location.href = "/payment/" + bill.id;
      } else {
        alert("Order placed successfully!");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Thanh toán giỏ hàng
      </Typography>
      <List>
        {cartItems.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
            }}>
            <Typography
              variant="body1"
              sx={{ marginRight: "16px", fontWeight: "bold" }}>
              {item.quantity}x
            </Typography>
            <img
              src={item.image}
              alt={item.product_name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                marginRight: "8px",
              }}
            />
            <ListItemText
              primary={item.product_name}
              secondary={
                <>
                  <Typography variant="body2">
                    Giá gốc (1 sp): {item.price.toLocaleString()} VND
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Thành tiền:{" "}
                    {item.discountedPrice !== item.price
                      ? `${(
                          item.quantity * item.discountedPrice
                        ).toLocaleString()} VND (Giảm giá: ${(
                          item.quantity *
                          (item.price - item.discountedPrice)
                        ).toLocaleString()} VND)`
                      : `${item.price.toLocaleString()} VND`}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Tổng giá tiền: {totalPrice.toLocaleString()} VND
      </Typography>
      <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h6">Phương thức thanh toán</Typography>
        <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
          <FormControlLabel
            value="COD"
            control={<Radio />}
            label="Thanh toán khi nhận hàng (COD)"
          />
          <FormControlLabel
            value="banking"
            control={<Radio />}
            label="Chuyển khoản ngân hàng"
          />
        </RadioGroup>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}>
          Thanh toán
        </Button>
      </FormControl>
    </Container>
  );
}

export default Cart;
