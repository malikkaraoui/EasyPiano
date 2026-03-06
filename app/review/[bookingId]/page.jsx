"use client";

import ProtectedRoute from "@components/Auth/ProtectedRoute";
import LeaveReview from "@pages/LeaveReview";

export default function ReviewPage() {
  return (
    <ProtectedRoute>
      <LeaveReview />
    </ProtectedRoute>
  );
}
