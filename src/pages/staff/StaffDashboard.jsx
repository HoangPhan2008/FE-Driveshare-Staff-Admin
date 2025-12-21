import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../configs/api";


// =======================
// LOGOUT HANDLER
// =======================
const handleLogout = async (navigate) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // Không cần xử lý gì thêm
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }
};


// =======================
// ICON WRAPPER
// =======================
const IconBox = ({ children, color = "text-indigo-500" }) => (
  <div className={`w-9 h-9 ${color} flex items-center justify-center`}>
    {children}
  </div>
);


// =======================
// SIDEBAR ITEM
// =======================
const SidebarItem = ({ label, to, icon, active }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
        ${active ? "bg-indigo-600 text-white shadow" : "text-gray-700 hover:bg-gray-200"}
      `}
    >
      {icon}
      {label}
    </button>
  );
};


// =======================
// DASHBOARD ACTION CARD
// =======================
const ActionCard = ({ title, desc, to }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(to)}
      className="cursor-pointer bg-white rounded-xl shadow p-6
                 hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {desc && <p className="text-sm text-gray-500">{desc}</p>}
    </div>
  );
};


// =======================
// MAIN PAGE
// =======================
export default function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ========================
  // MENU
  // ========================
  const menu = [
    { label: "Dashboard", to: "/staff", icon: <IconBox>🏠</IconBox> },
    { label: "Users", to: "/staff/users", icon: <IconBox color="text-indigo-500">👤</IconBox> },
    { label: "Document Reviews", to: "/staff/document-reviews", icon: <IconBox color="text-rose-500">📄</IconBox> },
    { label: "Contract Templates", to: "/staff/contract-templates", icon: <IconBox color="text-green-500">➕</IconBox> },
    { label: "Delivery Record Templates", to: "/staff/delivery-record-templates", icon: <IconBox color="text-orange-500">📋</IconBox> },
    { label: "Items", to: "/staff/items", icon: <IconBox color="text-blue-500">📦</IconBox> },
    { label: "Packages", to: "/staff/packages", icon: <IconBox color="text-purple-500">🧱</IconBox> },
    { label: "Post Packages", to: "/staff/post-packages", icon: <IconBox color="text-yellow-500">🚚</IconBox> },
    { label: "Post Trips", to: "/staff/post-trips", icon: <IconBox color="text-teal-500">🛣️</IconBox> },
    { label: "Trips", to: "/staff/trips", icon: <IconBox color="text-cyan-500">📍</IconBox> },
    { label: "Vehicles", to: "/staff/vehicles", icon: <IconBox color="text-red-500">🚗</IconBox> },
    { label: "Vehicle Document Reviews", to: "/staff/vehicle-document-reviews", icon: <IconBox color="text-teal-600">🧾</IconBox> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-5 space-y-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Staff Menu</h2>

        {menu.map((item, idx) => (
          <SidebarItem
            key={idx}
            {...item}
            active={location.pathname === item.to}
          />
        ))}

        <hr className="my-4" />

        <button
          onClick={() => handleLogout(navigate)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                     text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <IconBox color="text-red-500">⏻</IconBox>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Select an action below to start your work.
        </p>

        {/* QUICK ACTIONS */}
        <section className="space-y-10">

          {/* REVIEW */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Review & Approval</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard
                title="Document Reviews"
                desc="Review and approve user documents"
                to="/staff/document-reviews"
              />
              <ActionCard
                title="Vehicle Document Reviews"
                desc="Approve vehicle documents"
                to="/staff/vehicle-document-reviews"
              />
            </div>
          </div>

          {/* OPERATIONS */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionCard title="Trips" to="/staff/trips" />
              <ActionCard title="Post Trips" to="/staff/post-trips" />
              <ActionCard title="Post Packages" to="/staff/post-packages" />
            </div>
          </div>

          {/* MANAGEMENT */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ActionCard title="Users" to="/staff/users" />
              <ActionCard title="Vehicles" to="/staff/vehicles" />
              <ActionCard title="Items" to="/staff/items" />
              <ActionCard title="Packages" to="/staff/packages" />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
