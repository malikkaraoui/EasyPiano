"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import ManageReviews from "@pages/admin/ManageReviews";

export default function ManageReviewsPage() {
  return (
    <AdminRoute>
      <ManageReviews />
    </AdminRoute>
  );
}
