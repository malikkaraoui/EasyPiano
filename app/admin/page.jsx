"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import AdminDashboard from "@pages/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}
