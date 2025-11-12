import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Đảm bảo đường dẫn này đúng với cấu trúc thư mục của bạn
import LoginScreen from './pages/LoginScreen'
import StaffDashboard from './pages/staff/StaffDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import RequireRole from './components/RequireRole'

export default function App() {
  return (
    // BÀI TEST: Nếu Tailwind chạy, nền sẽ có MÀU ĐỎ
    <div className="bg-red-500 min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route
            path="/staff/*"
            element={
              <RequireRole allowedRoles={["Staff"]}>
                <StaffDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RequireRole allowedRoles={["Admin"]}>
                <AdminDashboard />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}