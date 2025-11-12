// screens/StaffDashboard.js
import React from 'react';

// Tái sử dụng các icon từ AdminDashboard hoặc import từ file chung
const TruckIcon = () => (
  <svg className="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5M1.5 14.25V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0122.5 6v8.25m-1.5 4.5H3.375" />
  </svg>
);
const DriverIcon = () => (
  <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const PendingIcon = () => (
  <svg className="w-8 h-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Component StatCard (Tái sử dụng)
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex justify-between items-start mb-4">
      {icon}
    </div>
    <div className="text-gray-500 text-sm uppercase">{title}</div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);


export default function StaffDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Staff Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome, staff user. Here are your current tasks.
      </p>

      {/* Lưới các Thẻ Thông tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Shipments"
          value="12"
          icon={<PendingIcon />}
        />
        <StatCard
          title="Active Shipments"
          value="84"
          icon={<TruckIcon />}
        />
        <StatCard
          title="Drivers Online"
          value="250"
          icon={<DriverIcon />}
        />
        <StatCard
          title="Support Tickets"
          value="3"
          icon={<div className="w-8 h-8 text-red-500">...</div>} // Thay bằng icon support
        />
      </div>

      {/* Bảng dữ liệu (ví dụ: các đơn hàng cần duyệt) */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Awaiting Approval</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Dữ liệu mẫu */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#DS-1024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">LogiCorp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">Review</a>
                </td>
              </tr>
              {/* Thêm các dòng khác... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}