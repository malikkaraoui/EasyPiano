"use client";

import AdminRoute from "@components/Auth/AdminRoute";
import Transactions from "@views/admin/Transactions";

export default function TransactionsPage() {
  return (
    <AdminRoute>
      <Transactions />
    </AdminRoute>
  );
}
