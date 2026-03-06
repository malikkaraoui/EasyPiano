"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import ManagePros from "@pages/admin/ManagePros";

export default function ManageProsPage() {
  return (
    <AdminRoute>
      <ManagePros />
    </AdminRoute>
  );
}
