import React from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";

const Contact = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to our tech store! We specialize in selling laptops, phones, and headphones. If you have any questions, feel free to reach out to us using the form below or through our contact details.
      </Typography>
      <Box sx={{ marginTop: "2rem" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Store Information</Typography>
            <Typography variant="body1">
              <strong>Address:</strong> 123 Tech Street, Innovation City, Techland
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> +1 (123) 456-7890
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> support@techstore.com
            </Typography>
            <Typography variant="body1">
              <strong>Working Hours:</strong> Mon - Fri: 9:00 AM - 6:00 PM
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Send Us a Message</Typography>
            <form>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Your Email"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Your Message"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: "1rem" }}
              >
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Contact;