"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import AddPro from "@pages/admin/AddPro";

export default function AddProPage() {
  return (
    <AdminRoute>
      <AddPro />
    </AdminRoute>
  );
}
