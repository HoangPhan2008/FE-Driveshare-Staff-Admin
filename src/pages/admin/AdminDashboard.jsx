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
} from "recharts";

// =======================
// LOGOUT HANDLER (GIỐNG STAFF)
// =======================
const handleLogout = async (navigate) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // không cần xử lý
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

  const [revenueSeries, setRevenueSeries] = useState([]);
  const [tripsByStatus, setTripsByStatus] = useState([]);

  // Wallet history
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

  const toIso = (d) => new Date(d).toISOString();

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

      const [overviewRes, revenueRes, tripsStatusRes] = await Promise.all([
        api.get("/Admin/overview"),
        api.get("/Admin/revenue", {
  params: {
    from: toIso(from),
    to: toIso(to),
    groupBy: "month",
  },
}),

        api.get("/Admin/trips/by-status"),
      ]);

      if (overviewRes?.data?.isSuccess) {
        setOverview(overviewRes.data.result);
      }

      if (revenueRes?.data?.isSuccess) {
        setRevenueSeries(revenueRes.data.result || []);
      }

      if (tripsStatusRes?.data?.isSuccess) {
        setTripsByStatus(tripsStatusRes.data.result || []);
      }
    } catch (err) {
      console.error(err);
      setError("Không tải được dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // FETCH WALLET HISTORY
  // ========================
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
    } else {
      fetchDashboard();
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
          {/* LOGOUT */}
  <hr className="my-4" />

  <button
    onClick={() => handleLogout(navigate)}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
               text-sm font-medium text-red-600 hover:bg-red-50 transition"
  >
    <IconBox color="text-red-500">
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H9m6 0l-3-3m3 3l-3 3"
        />
      </svg>
    </IconBox>
    Logout
  </button>
</aside>



      {/* MAIN */}
      <main className="flex-1 p-10">
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

        {/* CHART ROW */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Revenue */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Revenue over time</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Line dataKey="value" stroke="#16A34A" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trips by status */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Trips by status</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tripsByStatus}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={95}
                  >
                    {tripsByStatus.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* WALLET HISTORY */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
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
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
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

          {/* Pagination */}
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
        </div>
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
