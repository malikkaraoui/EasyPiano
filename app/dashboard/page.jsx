"use client";

import ProtectedRoute from "@components/Auth/ProtectedRoute";
import ClientDashboard from "@views/ClientDashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ClientDashboard />
    </ProtectedRoute>
  );
}
