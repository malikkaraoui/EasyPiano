"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import ManageBookings from "@pages/admin/ManageBookings";

export default function ManageBookingsPage() {
  return (
    <AdminRoute>
      <ManageBookings />
    </AdminRoute>
  );
}
