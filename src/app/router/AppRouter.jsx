import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import AdminRoute from "@components/Auth/AdminRoute";
import Home from "@pages/Home";
import Search from "@pages/Search";
import ProProfile from "@pages/ProProfile";
import Login from "@pages/Login";
import ClientDashboard from "@pages/ClientDashboard";
import Booking from "@pages/Booking";
import LeaveReview from "@pages/LeaveReview";
import AdminDashboard from "@pages/admin/AdminDashboard";
import ManagePros from "@pages/admin/ManagePros";
import AddPro from "@pages/admin/AddPro";
import ManageBookings from "@pages/admin/ManageBookings";
import ManageReviews from "@pages/admin/ManageReviews";
import Transactions from "@pages/admin/Transactions";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/pro/:proId" element={<ProProfile />} />
      <Route path="/login" element={<Login />} />

      {/* Client (authenticated) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:proId"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:bookingId"
        element={
          <ProtectedRoute>
            <LeaveReview />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pros"
        element={
          <AdminRoute>
            <ManagePros />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pros/add"
        element={
          <AdminRoute>
            <AddPro />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pros/edit/:proId"
        element={
          <AdminRoute>
            <AddPro />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <ManageBookings />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <AdminRoute>
            <ManageReviews />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <AdminRoute>
            <Transactions />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
