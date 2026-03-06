"use client";

import ProtectedRoute from "@components/Auth/ProtectedRoute";
import Booking from "@pages/Booking";

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <Booking />
    </ProtectedRoute>
  );
}
