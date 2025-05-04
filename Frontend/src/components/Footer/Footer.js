import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 6,
        mt: "auto",
      }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Về cửa hàng
            </Typography>
            <Typography variant="body2">
              Nguồn đáng tin cậy của bạn cho các sản phẩm điện tử. Cửa hàng
              cung cấp nhiều loại máy tính xách tay, điện thoại, tai nghe và
              nhiều sản phẩm khác.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Liên kết nhanh
            </Typography>
            <Link
              component={RouterLink}
              to="/products"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}>
              Sản phẩm
            </Link>
            <Link
              component={RouterLink}
              to="/cart"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}>
              Giỏ hàng
            </Link>
            <Link
              component={RouterLink}
              to="/login"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}>
              Đăng nhập
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Liên hệ với cửa hàng
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Số 2 Nguyễn Đình Chiểu, TP. Nha Trang, Khánh Hòa
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1 }} />
              <Typography variant="body2">+84 123 456 789</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="body2">duy.hn.63cntt@ntu.edu.vn</Typography>
            </Box>
            <Box>
              <IconButton color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Bản quyền thuộc về Hồ Ngọc Duy, MSSV: 63130262
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
