"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import Transactions from "@pages/admin/Transactions";

export default function TransactionsPage() {
  return (
    <AdminRoute>
      <Transactions />
    </AdminRoute>
  );
}
