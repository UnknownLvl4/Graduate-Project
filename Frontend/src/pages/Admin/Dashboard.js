import React from 'react';
import { Container, Typography } from '@mui/material';

function Dashboard() {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Admin Dashboard
      </Typography>
    </Container>
  );
}

export default Dashboard; 