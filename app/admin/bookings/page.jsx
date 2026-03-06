"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import ManageBookings from "@views/admin/ManageBookings";

export default function ManageBookingsPage() {
  return (
    <AdminRoute>
      <ManageBookings />
    </AdminRoute>
  );
}
