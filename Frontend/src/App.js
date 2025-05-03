import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

// Layout Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Pages
import Home from "./pages/Home/Home";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProductDetail from "./pages/Admin/ProductDetail";
import AllProductsByCategory from "./pages/Products/AllProductsByCategory";
import ProductsByCategory from "./pages/Products/ProductsByCategory";
import ProductsBySubcategory from "./pages/Products/ProductsBySubcategory";
import Contact from "./pages/Contact/Contact";
import Payment from "./pages/Payment/Payment";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<AllProductsByCategory />} />
              <Route
                path="/products/:category"
                element={<ProductsByCategory />}
              />
              <Route
                path="/products/:category/:sub_category"
                element={<ProductsBySubcategory />}
              />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/payment/:billId" element={<Payment />} />
              {user?.isAdmin ? (
                <>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route
                    path="/admin/products/:category_id/:product_id"
                    element={<AdminProductDetail />}
                  />
                </>
              ) : (
                <Route path="/admin/*" element={<Home />} />
              )}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
