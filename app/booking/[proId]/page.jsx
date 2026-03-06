"use client";

import ProtectedRoute from "@components/Auth/ProtectedRoute";
import Booking from "@views/Booking";

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <Booking />
    </ProtectedRoute>
  );
}
