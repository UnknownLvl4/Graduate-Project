import React from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";

const Contact = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Liên hệ với cửa hàng
      </Typography>
      <Typography variant="body1" gutterBottom>
        Chào mừng đến với cửa hàng công nghệ HND! Cửa hàng chuyên bán
        máy tính xách tay, điện thoại và tai nghe. Nếu bạn có bất kỳ câu hỏi
        nào, vui lòng liên hệ với cửa hàng bằng biểu mẫu bên dưới hoặc thông
        qua thông tin liên hệ của cửa hàng.
      </Typography>
      <Box sx={{ marginTop: "2rem" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Thông tin cửa hàng</Typography>
            <Typography variant="body1">
              <strong>Địa chỉ:</strong> Số 2 Nguyễn Đình Chiểu, TP. Nha Trang, Khánh Hòa
            </Typography>
            <Typography variant="body1">
              <strong>Số điện thoại:</strong> +84 123 456 789
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> duy.hn.63cntt@ntu.edu.vn
            </Typography>
            <Typography variant="body1">
              <strong>Giờ làm việc:</strong> Thứ Hai - Thứ Sáu: 8:00 sáng - 6:00 chiều
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Gửi tin nhắn cho chúng tôi</Typography>
            <form>
              <TextField
                fullWidth
                label="Tên của bạn"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email của bạn"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phản hồi của bạn"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: "1rem" }}>
                Gửi
              </Button>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Contact;
