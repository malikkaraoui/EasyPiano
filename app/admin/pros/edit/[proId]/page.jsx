"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import AddPro from "@views/admin/AddPro";

export default function EditProPage() {
  return (
    <AdminRoute>
      <AddPro />
    </AdminRoute>
  );
}
