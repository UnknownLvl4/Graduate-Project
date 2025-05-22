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
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filteredData, setFilteredData] = useState([]);
  const [minTotal, setMinTotal] = useState(0);
  const [maxTotal, setMaxTotal] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

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

    const fetchOrderItems = async () => {
      try {
        const response = await adminService.getOrderItems();
        setOrderItems(response.data || []);
      } catch (err) {
        setError("Không thể lấy dữ liệu doanh số bán hàng");
        console.error(err);
      }
    };

    fetchOrders();
    fetchOrderItems();
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

    let filtered = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= start && orderDate <= end;
    });

    // Lọc theo số tiền nếu có
    if (minTotal > 0) {
      filtered = filtered.filter(
        (order) => parseFloat(order.total) >= minTotal
      );
    }
    if (maxTotal > 0) {
      filtered = filtered.filter(
        (order) => parseFloat(order.total) <= maxTotal
      );
    }

    // Chuẩn bị dữ liệu cho bảng và chart
    const dailyRevenue = {};
    const tableRows = [];

    filtered.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(order.total);
      tableRows.push({
        date,
        total: parseFloat(order.total),
      });
    });

    setFilteredData(dailyRevenue);
    setTableData(tableRows);
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
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              type="date"
              label="Ngày bắt đầu"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              type="date"
              label="Ngày kết thúc"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <TextField
              type="number"
              label="Số tiền tối thiểu"
              InputLabelProps={{ shrink: true }}
              value={minTotal}
              onChange={(e) => setMinTotal(Number(e.target.value))}
              sx={{ minWidth: 150 }}
            />
            <TextField
              type="number"
              label="Số tiền tối đa"
              InputLabelProps={{ shrink: true }}
              value={maxTotal}
              onChange={(e) => setMaxTotal(Number(e.target.value))}
              sx={{ minWidth: 150 }}
            />
            <Button variant="contained" onClick={filterOrdersByDateRange}>
              Xem thống kê
            </Button>
          </Box>
          {/* Bảng doanh thu bán hàng */}
          {tableData.length > 0 ? (
            <Box sx={{ overflowX: "auto", mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Bảng doanh thu bán hàng (theo sản phẩm)
              </Typography>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  marginBottom: 16,
                }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Mã sản phẩm
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Số lượng bán
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Tổng doanh thu (VND)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Lọc orderItems theo ngày và số tiền nếu có
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    end.setDate(end.getDate() + 1);
                    // Lọc orderItems theo các đơn hàng phù hợp với bộ lọc (dựa vào bill_id/order_id)
                    // Lấy danh sách order_id của các đơn hàng phù hợp với filter ngày và số tiền
                    let filteredOrders = orders.filter((order) => {
                      const orderDate = new Date(order.created_at);
                      return orderDate >= start && orderDate <= end;
                    });
                    if (minTotal > 0) {
                      filteredOrders = filteredOrders.filter(
                        (order) => parseFloat(order.total) >= minTotal
                      );
                    }
                    if (maxTotal > 0) {
                      filteredOrders = filteredOrders.filter(
                        (order) => parseFloat(order.total) <= maxTotal
                      );
                    }
                    const validOrderIds = new Set(
                      filteredOrders.map((order) => order.id || order.bill_id)
                    );
                    // Lọc orderItems theo order_id/bill_id thuộc validOrderIds
                    let filtered = orderItems.filter((item) =>
                      validOrderIds.has(item.bill_id)
                    );
                    if (minTotal > 0) {
                      filtered = filtered.filter(
                        (item) => item.price * item.quantity >= minTotal
                      );
                    }
                    if (maxTotal > 0) {
                      filtered = filtered.filter(
                        (item) => item.price * item.quantity <= maxTotal
                      );
                    }
                    // Gom nhóm theo product_id
                    const productMap = {};
                    filtered.forEach((item) => {
                      if (!productMap[item.product_id]) {
                        productMap[item.product_id] = {
                          product_id: item.product_id,
                          product_name: item.product_name || "",
                          quantity: 0,
                          total: 0,
                        };
                      }
                      productMap[item.product_id].quantity += item.quantity;
                      productMap[item.product_id].total +=
                        item.price * item.quantity;
                    });
                    const rows = Object.values(productMap);
                    return rows.length > 0 ? (
                      rows.map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ border: "1px solid #ddd", padding: 8 }}>
                            {row.product_id}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: 8 }}>
                            {row.quantity}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: 8 }}>
                            {row.total.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          style={{ textAlign: "center", padding: 8 }}>
                          Không có dữ liệu
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: "bold", background: "#e3e3e3" }}>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      Tổng
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      {(() => {
                        // Tổng số lượng bán theo nội dung bảng
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        end.setDate(end.getDate() + 1);
                        let filteredOrders = orders.filter((order) => {
                          const orderDate = new Date(order.created_at);
                          return orderDate >= start && orderDate <= end;
                        });
                        if (minTotal > 0) {
                          filteredOrders = filteredOrders.filter(
                            (order) => parseFloat(order.total) >= minTotal
                          );
                        }
                        if (maxTotal > 0) {
                          filteredOrders = filteredOrders.filter(
                            (order) => parseFloat(order.total) <= maxTotal
                          );
                        }
                        const validOrderIds = new Set(
                          filteredOrders.map(
                            (order) => order.id || order.bill_id
                          )
                        );
                        let filtered = orderItems.filter((item) =>
                          validOrderIds.has(item.bill_id)
                        );
                        if (minTotal > 0) {
                          filtered = filtered.filter(
                            (item) => item.price * item.quantity >= minTotal
                          );
                        }
                        if (maxTotal > 0) {
                          filtered = filtered.filter(
                            (item) => item.price * item.quantity <= maxTotal
                          );
                        }
                        // Gom nhóm theo product_id
                        const productMap = {};
                        filtered.forEach((item) => {
                          if (!productMap[item.product_id]) {
                            productMap[item.product_id] = {
                              product_id: item.product_id,
                              product_name: item.product_name || "",
                              quantity: 0,
                              total: 0,
                            };
                          }
                          productMap[item.product_id].quantity += item.quantity;
                          productMap[item.product_id].total +=
                            item.price * item.quantity;
                        });
                        const rows = Object.values(productMap);
                        return rows.reduce((sum, row) => sum + row.quantity, 0);
                      })()}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      {(() => {
                        // Tổng doanh thu theo nội dung bảng
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        end.setDate(end.getDate() + 1);
                        let filteredOrders = orders.filter((order) => {
                          const orderDate = new Date(order.created_at);
                          return orderDate >= start && orderDate <= end;
                        });
                        if (minTotal > 0) {
                          filteredOrders = filteredOrders.filter(
                            (order) => parseFloat(order.total) >= minTotal
                          );
                        }
                        if (maxTotal > 0) {
                          filteredOrders = filteredOrders.filter(
                            (order) => parseFloat(order.total) <= maxTotal
                          );
                        }
                        const validOrderIds = new Set(
                          filteredOrders.map(
                            (order) => order.id || order.bill_id
                          )
                        );
                        let filtered = orderItems.filter((item) =>
                          validOrderIds.has(item.bill_id)
                        );
                        if (minTotal > 0) {
                          filtered = filtered.filter(
                            (item) => item.price * item.quantity >= minTotal
                          );
                        }
                        if (maxTotal > 0) {
                          filtered = filtered.filter(
                            (item) => item.price * item.quantity <= maxTotal
                          );
                        }
                        // Gom nhóm theo product_id
                        const productMap = {};
                        filtered.forEach((item) => {
                          if (!productMap[item.product_id]) {
                            productMap[item.product_id] = {
                              product_id: item.product_id,
                              product_name: item.product_name || "",
                              quantity: 0,
                              total: 0,
                            };
                          }
                          productMap[item.product_id].quantity += item.quantity;
                          productMap[item.product_id].total +=
                            item.price * item.quantity;
                        });
                        const rows = Object.values(productMap);
                        return rows
                          .reduce((sum, row) => sum + row.total, 0)
                          .toLocaleString();
                      })()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Box>
          ) : null}
          {/* Bảng thống kê doanh số */}
          {tableData.length > 0 ? (
            <Box sx={{ overflowX: "auto", mb: 3 }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  marginBottom: 16,
                }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Ngày
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: 8 }}>
                      Tổng tiền (VND)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        {row.date}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: 8 }}>
                        {row.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: "bold", background: "#e3e3e3" }}>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      Tổng
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      {tableData
                        .reduce((sum, row) => sum + row.total, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Box>
          ) : null}
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
