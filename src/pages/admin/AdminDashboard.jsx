// screens/AdminDashboard.js
import React from 'react';

// Icons (nên tách ra file riêng, nhưng để tạm ở đây cho tiện)
const UsersIcon = () => (
  <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 00-3.742-.565M18 18.72a9.094 9.094 0 01-3.742-.565m3.742.565a9.094 9.094 0 00-3.742-.565M12 3c-3.135 0-6 2.69-6 6v3.75c0 3.315 2.865 6 6 6s6-2.685 6-6V9c0-3.31-2.865-6-6-6zM6 9c0 1.503 1.007 2.75 2.25 2.75S10.5 10.503 10.5 9s-1.007-2.75-2.25-2.75S6 7.497 6 9zm6 0c0 1.503 1.007 2.75 2.25 2.75S16.5 10.503 16.5 9s-1.007-2.75-2.25-2.75S12 7.497 12 9z" />
  </svg>
);
const TruckIcon = () => (
  <svg className="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5M1.5 14.25V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0122.5 6v8.25m-1.5 4.5H3.375" />
  </svg>
);
const DollarIcon = () => (
  <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6m-6.75-9.75a9 9 0 0113.5 0m-13.5 0a9 9 0 0013.5 0M4.25 6.75a9 9 0 0115.5 0m-15.5 0a9 9 0 0015.5 0" />
  </svg>
);

const StatCard = ({ title, value, icon, change, changeType }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex justify-between items-start mb-4">
      {icon}
      <span className={`text-sm font-semibold ${changeType === 'inc' ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
    </div>
    <div className="text-gray-500 text-sm uppercase">{title}</div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome, administrator. Here's the system overview.
      </p>

      {/* Lưới các Thẻ Thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue (Month)"
          value="$120,450"
          icon={<DollarIcon />}
          change="+12.5%"
          changeType="inc"
        />
        <StatCard
          title="Total Shipments"
          value="8,920"
          icon={<TruckIcon />}
          change="+8.2%"
          changeType="inc"
        />
        <StatCard
          title="Total Users"
          value="1,500"
          icon={<UsersIcon />}
          change="+3"
          changeType="inc"
        />
        <StatCard
          title="System Health"
          value="99.9% Uptime"
          icon={<div className="w-8 h-8 text-green-500">...</div>} // Thay bằng icon health
          change="All Good"
          changeType="inc"
        />
      </div>

      {/* Thêm các biểu đồ hoặc bảng dữ liệu ở đây */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
        {/* Chỗ này để component biểu đồ (chart) */}
        <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
          <p className="text-gray-500">[Chart Placeholder]</p>
        </div>
      </div>
    </div>
  );
}