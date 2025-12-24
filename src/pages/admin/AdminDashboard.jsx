import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../configs/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// =======================
// LOGOUT HANDLER (GIỐNG STAFF)
// =======================
const handleLogout = async (navigate) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // ignore
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }
};

// ========================
// ICON WRAPPER
// ========================
const IconBox = ({ children, color = "text-indigo-500" }) => (
  <div className={`w-9 h-9 ${color} flex items-center justify-center`}>
    {children}
  </div>
);

// ========================
// SIDEBAR ITEM
// ========================
const SidebarItem = ({ label, to, icon, active }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
        ${
          active
            ? "bg-indigo-600 text-white shadow"
            : "text-gray-700 hover:bg-gray-200"
        }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetchedRef = useRef(false);

  // ========================
  // STATE
  // ========================
  const [rangeMonths, setRangeMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalRevenue: 0,
    totalPackages: 0,
  });

  const [userRegistration, setUserRegistration] = useState([]);
  const [tripsByStatus, setTripsByStatus] = useState([]);
  const [usersByRole, setUsersByRole] = useState([]);
  const [packagesByStatus, setPackagesByStatus] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const [walletHistory, setWalletHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);

  const PIE_COLORS = [
    "#6366F1",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#A855F7",
  ];

  // ========================
  // HELPERS
  // ========================
  const getDateRange = (months) => {
    const now = new Date();
    const to = new Date(now.setHours(23, 59, 59, 999));
    const from = new Date(to);
    from.setMonth(from.getMonth() - months);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  };

  const toIso = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    // Chỉ gửi ngày, không gửi giờ - để BE tự hiểu theo local timezone
    return `${year}-${month}-${day}`;
  };

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  // ========================
  // FETCH DASHBOARD
  // ========================
  const fetchDashboard = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const { from, to } = getDateRange(rangeMonths);

      const [
        overviewRes,
        userRegRes,
        tripsStatusRes,
        usersByRoleRes,
        packagesStatusRes,
        transactionsRes,
      ] = await Promise.all([
        api.get("/Admin/overview"),
        api.get("/Admin/users/registration", {
          params: { from: toIso(from), to: toIso(to), groupBy: "month" },
        }),
        api.get("/Admin/trips/by-status"),
        api.get("/Admin/users/by-role"),
        api.get("/Admin/packages/by-status"),
        api.get("/Transaction", {
          params: { pageNumber: 1, pageSize: 8 },
        }),
      ]);

      if (overviewRes?.data?.isSuccess) setOverview(overviewRes.data.result);

      if (userRegRes?.data?.isSuccess)
        setUserRegistration(userRegRes.data.result || []);

      if (tripsStatusRes?.data?.isSuccess)
        setTripsByStatus(tripsStatusRes.data.result || []);

      if (usersByRoleRes?.data?.isSuccess) {
        const mapped = usersByRoleRes.data.result.map((item) => ({
          role: item.role,
          count: item.count,
        }));
        setUsersByRole(mapped);
      }

      if (packagesStatusRes?.data?.isSuccess)
        setPackagesByStatus(packagesStatusRes.data.result || []);

      if (transactionsRes?.data?.isSuccess) {
        setRecentTransactions(transactionsRes.data.result?.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Không tải được dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletHistory = async (page = 1) => {
    try {
      setHistoryLoading(true);
      const res = await api.get("/Wallets/my-wallet", {
        params: { pageNumber: page, pageSize: historyPageSize },
      });

      if (res?.data?.isSuccess) {
        setWalletHistory(res.data.result.items || []);
        setHistoryTotal(res.data.result.totalCount || 0);
        setHistoryPage(page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchDashboard();
      fetchWalletHistory(1);
    }
  }, [rangeMonths]);

  // ========================
  // RENDER
  // ========================
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-5 space-y-2">
        <h2 className="text-xl font-bold mb-4">Admin Menu</h2>

        <SidebarItem
          label="Dashboard"
          to="/admin"
          active={location.pathname === "/admin"}
          icon={<IconBox>🏠</IconBox>}
        />
        <SidebarItem
          label="Users"
          to="/admin/users"
          active={location.pathname === "/admin/users"}
          icon={<IconBox>👤</IconBox>}
        />
        <SidebarItem
          label="Transactions"
          to="/admin/transactions"
          active={location.pathname === "/admin/transactions"}
          icon={<IconBox color="text-green-600">💰</IconBox>}
        />
        <SidebarItem
          label="Platform Wallet"
          to="/admin/platform-wallet"
          active={location.pathname === "/admin/platform-wallet"}
          icon={<IconBox color="text-purple-600">🏦</IconBox>}
        />

        <hr className="my-4" />

        <button
          onClick={() => handleLogout(navigate)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                     text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <IconBox color="text-red-500">🚪</IconBox>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">
        {location.pathname === "/admin" && (
          <>
            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <KpiCard title="Total Users" value={overview.totalUsers} />
              <KpiCard title="Total Trips" value={overview.totalTrips} />
              <KpiCard
                title="Total Revenue"
                value={formatCurrency(overview.totalRevenue)}
              />
              <KpiCard title="Total Packages" value={overview.totalPackages} />
            </div>

            {/* CHART ROW 1 */}
            <div className="grid lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4 text-lg">
                  📈 User Registration Trend
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userRegistration}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="label" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={{ fill: "#6366F1", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4 text-lg">👥 Users by Role</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByRole}
                        dataKey="count"
                        nameKey="role"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.role}: ${entry.count}`}
                      >
                        {usersByRole.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* CHART ROW 2 */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4 text-lg">
                  🚗 Trips by Status
                </h2>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tripsByStatus}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                        outerRadius={90}
                      >
                        {tripsByStatus.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4 text-lg">
                  📦 Packages by Status
                </h2>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={packagesByStatus}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                        outerRadius={90}
                      >
                        {packagesByStatus.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RECENT TRANSACTIONS CHART */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-xl text-gray-800">
                    💳 Recent Transaction Flow
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Latest 8 transactions activity
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/transactions")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition shadow-sm hover:shadow-md"
                >
                  View All →
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-xs text-green-600 font-semibold mb-1">
                    ↑ INCOME
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(
                      recentTransactions
                        .filter((tx) => tx.amount > 0)
                        .reduce((sum, tx) => sum + tx.amount, 0)
                    )}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {recentTransactions.filter((tx) => tx.amount > 0).length}{" "}
                    transactions
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-xs text-red-600 font-semibold mb-1">
                    ↓ EXPENSE
                  </div>
                  <div className="text-2xl font-bold text-red-700">
                    {formatCurrency(
                      Math.abs(
                        recentTransactions
                          .filter((tx) => tx.amount < 0)
                          .reduce((sum, tx) => sum + tx.amount, 0)
                      )
                    )}
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    {recentTransactions.filter((tx) => tx.amount < 0).length}{" "}
                    transactions
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 font-semibold mb-1">
                    📈 NET FLOW
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(
                      recentTransactions.reduce((sum, tx) => sum + tx.amount, 0)
                    )}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Total: {recentTransactions.length} transactions
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="h-[320px]">
                  {recentTransactions.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={recentTransactions.map((tx, idx) => ({
                          name: `#${idx + 1}`,
                          type: tx.type,
                          income: tx.amount > 0 ? tx.amount : 0,
                          expense: tx.amount < 0 ? Math.abs(tx.amount) : 0,
                          status: tx.status,
                          description: tx.description,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="name"
                          stroke="#6B7280"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          stroke="#6B7280"
                          style={{ fontSize: "12px" }}
                          tickFormatter={(value) =>
                            `${(value / 1000000).toFixed(1)}M`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                            padding: "12px",
                          }}
                          formatter={(value, name) => [
                            formatCurrency(value),
                            name === "income" ? "Income" : "Expense",
                          ]}
                          labelFormatter={(label) => `Transaction ${label}`}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "20px" }}
                          iconType="circle"
                        />
                        <Bar
                          dataKey="income"
                          fill="#10B981"
                          radius={[8, 8, 0, 0]}
                          name="Income"
                        />
                        <Bar
                          dataKey="expense"
                          fill="#EF4444"
                          radius={[8, 8, 0, 0]}
                          name="Expense"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📈</div>
                        <div>No transaction data available</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Type Legend */}
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from(
                  new Set(recentTransactions.map((tx) => tx.type))
                ).map((type, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* WALLET HISTORY */}
            {/* <div className="mt-8 bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Transaction history</h2>

              {historyLoading ? (
                <div>Loading...</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b text-gray-500">
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th className="text-right">Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletHistory.map((tx, i) => (
                      <tr key={i} className="border-b">
                        <td>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td>{tx.type}</td>
                        <td>{tx.description}</td>
                        <td className="text-right">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td>{tx.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  disabled={historyPage === 1}
                  onClick={() => fetchWalletHistory(historyPage - 1)}
                  className="px-3 py-1 border rounded"
                >
                  Prev
                </button>
                <button
                  disabled={historyPage * historyPageSize >= historyTotal}
                  onClick={() => fetchWalletHistory(historyPage + 1)}
                  className="px-3 py-1 border rounded"
                >
                  Next
                </button>
              </div>
            </div> */}
          </>
        )}
      </main>
    </div>
  );
}

// ========================
// KPI CARD
// ========================
function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
