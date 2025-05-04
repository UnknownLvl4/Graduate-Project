import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Alert } from "@mui/material";

const Payment = () => {
  const { billId } = useParams(); // Get bill ID from URL params
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // Simulate fetching QR code URL from the server
    const fetchQrCode = async () => {
      try {
        // Replace this with your actual API call to fetch the QR code
        const qrCode = "http://localhost:3001/uploads/qr.png";
        setQrCodeUrl(qrCode);
      } catch (error) {
        console.error("Error fetching QR code:", error);
      }
    };

    fetchQrCode();
  }, []);

  const handleConfirmPayment = () => {
    // Simulate confirming payment
    setIsPaid(true);
    alert("Giao dịch đã được xác nhận! Cảm ơn bạn đã mua hàng.");
    navigate("/"); // Redirect to the home page or another page
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thanh toán cho đơn hàng #{billId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Vui lòng thanh toán hóa đơn của bạn bằng cách quét mã QR bên dưới.
        <br />
        Xin vui lòng đảm bảo bao gồm ID hóa đơn <strong>#{billId}</strong> trong nội dung giao dịch.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}>
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="Banking QR Code"
            style={{ width: "300px", marginBottom: "16px" }}
          />
        ) : (
          <Alert severity="info">Loading QR code...</Alert>
        )}
        <Typography variant="body2" sx={{ mb: 2 }}>
          Quét mã QR này bằng ứng dụng ngân hàng của bạn để thực hiện thanh toán.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmPayment}
          disabled={isPaid}>
          {isPaid ? "Đã chuyển khoản" : "Xác nhận đã chuyển khoản"}
        </Button>
      </Box>
    </Container>
  );
};

export default Payment;
