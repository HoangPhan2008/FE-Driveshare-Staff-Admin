import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const IconBox = ({ children, color = "text-indigo-500" }) => (
  <div className={`w-9 h-9 ${color} flex items-center justify-center`}>
    {children}
  </div>
);

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

export default function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      label: "Dashboard",
      to: "/staff",
      icon: (
        <IconBox>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
              d="M3 12l2-2m0 0l7-7 7 7m-9-7v18"/>
          </svg>
        </IconBox>
      )
    },

    /* --- CONTRACTS --- */
    {
      label: "Contract Templates",
      to: "/staff/contract-templates",
      icon: (
        <IconBox color="text-green-500">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 6v12m6-6H6" />
          </svg>
        </IconBox>
      )
    },
    {
      label: "Contract Terms",
      to: "/staff/contract-terms",
      icon: (
        <IconBox color="text-blue-500">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </IconBox>
      )
    },

    /* --- FLOW 2 --- */
    {
      label: "View All Item",
      to: "/staff/items",
      icon: (
        <IconBox color="text-purple-500">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 7h18M3 12h18M3 17h18"/>
          </svg>
        </IconBox>
      )
    },
    {
      label: "View All Package",
      to: "/staff/packages",
      icon: (
        <IconBox color="text-orange-500">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 4h16v16H4z" />
          </svg>
        </IconBox>
      )
    },
    {
      label: "View All Post Package",
      to: "/staff/post-packages",
      icon: (
        <IconBox color="text-yellow-600">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5 8h14M5 12h14M5 16h14"/>
          </svg>
        </IconBox>
      )
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-white shadow-lg p-5 space-y-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Staff Menu</h2>

        {menu.map((item, idx) => (
          <SidebarItem
            key={idx}
            {...item}
            active={location.pathname === item.to}
          />
        ))}
      </aside>

      <main className="flex-1 p-10">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Staff Dashboard</h1>
        <p className="text-gray-600 mb-10">
          Welcome, staff user. Manage your workflow efficiently.
        </p>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <IconBox color="text-yellow-500">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0" />
                </svg>
              </IconBox>
            </div>
            <div className="text-gray-500 text-sm uppercase">Pending Shipments</div>
            <div className="text-3xl font-bold">12</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <IconBox color="text-green-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 12h18" />
                </svg>
              </IconBox>
            </div>
            <div className="text-gray-500 text-sm uppercase">Active Shipments</div>
            <div className="text-3xl font-bold">84</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <IconBox color="text-blue-500">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 6a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </IconBox>
            </div>
            <div className="text-gray-500 text-sm uppercase">Drivers Online</div>
            <div className="text-3xl font-bold">250</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <IconBox color="text-red-500">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v4m0 4h.01" />
                </svg>
              </IconBox>
            </div>
            <div className="text-gray-500 text-sm uppercase">Support Tickets</div>
            <div className="text-3xl font-bold">3</div>
          </div>

        </div>
      </main>
    </div>
  );
}
