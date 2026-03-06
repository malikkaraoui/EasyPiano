"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import ManagePros from "@views/admin/ManagePros";

export default function ManageProsPage() {
  return (
    <AdminRoute>
      <ManagePros />
    </AdminRoute>
  );
}
