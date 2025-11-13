import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginScreen from './pages/LoginScreen';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequireRole from './components/RequireRole';
import ContractTemplatePage from './pages/staff/ContractTemplatePage';
import ContractTermPage from './pages/staff/ContractTermPage';
import ItemListPage from "./pages/staff/ItemListPage";
import PackageListPage from "./pages/staff/PackageListPage";
import PostPackageListPage from "./pages/staff/PostPackageListPage";



export default function App() {
  return (
    <div className="bg-red-500 min-h-screen">
      <BrowserRouter>
        <Routes>

          {/* LOGIN PAGE */}
          <Route path="/" element={<LoginScreen />} />

          {/* STAFF DASHBOARD */}
          <Route
            path="/staff"
            element={
              <RequireRole allowedRoles={['Staff']}>
                <StaffDashboard />
              </RequireRole>
            }
          />

          <Route
  path="/staff/contract-terms"
  element={
    <RequireRole allowedRoles={['Staff']}>
      <ContractTermPage />
    </RequireRole>
  }
/>
<Route
  path="/staff/items"
  element={
    <RequireRole allowedRoles={['Staff']}>
      <ItemListPage />
    </RequireRole>
  }
/>

<Route
  path="/staff/packages"
  element={
    <RequireRole allowedRoles={['Staff']}>
      <PackageListPage />
    </RequireRole>
  }
/>

<Route
  path="/staff/post-packages"
  element={
    <RequireRole allowedRoles={['Staff']}>
      <PostPackageListPage />
    </RequireRole>
  }
/>


          {/* CONTRACT TEMPLATE PAGE */}
          <Route
            path="/staff/contract-templates"
            element={
              <RequireRole allowedRoles={['Staff']}>
                <ContractTemplatePage />
              </RequireRole>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <RequireRole allowedRoles={['Admin']}>
                <AdminDashboard />
              </RequireRole>
            }
          />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}
