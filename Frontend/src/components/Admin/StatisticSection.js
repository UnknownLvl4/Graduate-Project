import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import * as adminService from "../../services/adminService";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatisticSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await adminService.getOrders(); // Fetch orders from AdminService
        setOrders(response.data || []);
      } catch (err) {
        setError("Không thể tìm được đơn hàng");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterOrdersByDateRange = () => {
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    if (start > end) {
      setError("Ngày bắt đầu không thể sau ngày kết thúc.");
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= start && orderDate <= end;
    });

    const dailyRevenue = {};

    filtered.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(order.total);
    });

    setFilteredData(dailyRevenue);
    setError(null);
  };

  const chartData = () => {
    return {
      labels: Object.keys(filteredData),
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: Object.values(filteredData),
          backgroundColor: "#3f51b5",
        },
      ],
    };
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Thống kê doanh thu
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {error ? <Typography color="error">{error}</Typography> : null}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              type="date"
              label="Ngày bắt đầu"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
            <TextField
              type="date"
              label="Ngày kết thúc"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={filterOrdersByDateRange}>
              Lọc
            </Button>
          </Box>
          {Object.keys(filteredData).length > 0 ? (
            <Box sx={{ maxWidth: "600px", mx: "auto" }}>
              <Bar
                data={chartData()}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          ) : (
            <Typography>Không có dữ liệu nào cho phạm vi đã chọn.</Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default StatisticSection;
