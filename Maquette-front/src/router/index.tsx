import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Import des composants existants de Maquette-front
import { Catalog } from "@/app/components/Catalog";
import { Dashboard } from "@/app/components/Dashboard";
import { BookingForm } from "@/app/components/BookingForm";
import { PropertyDetail } from "@/app/components/PropertyDetail";
import { MyBookings } from "@/app/components/MyBookings";
import { BookingDetail } from "@/app/components/BookingDetail";
import { UserProfile } from "@/app/components/UserProfile";
import { MyGroups } from "@/app/components/MyGroups";
import { GroupPendingRequests } from "@/app/components/GroupPendingRequests";
import { GroupManagement } from "@/app/components/GroupManagement";
import { JoinGroup } from "@/app/components/JoinGroup";
import { AdminDashboard } from "@/app/components/AdminDashboard";
import { AdminBookings } from "@/app/components/AdminBookings";
import { AdminUsers } from "@/app/components/AdminUsers";
import { AdminGroups } from "@/app/components/AdminGroups";
import { ManageBiens } from "@/app/components/ManageBiens";
import { ManageGroupes } from "@/app/components/ManageGroupes";
import { ManageTypeGroupes } from "@/app/components/ManageTypeGroupes";
import { AuditLog } from "@/app/components/AuditLog";
import { NotFound } from "@/app/components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "property/:resourceId",
        element: <PropertyDetail />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking/:resourceId",
        element: (
          <ProtectedRoute>
            <BookingForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking-detail/:bookingId",
        element: (
          <ProtectedRoute>
            <BookingDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-groups",
        element: (
          <ProtectedRoute>
            <MyGroups />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-groups/pending",
        element: (
          <ProtectedRoute>
            <GroupPendingRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "groups/:groupId/manage",
        element: (
          <ProtectedRoute>
            <GroupManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "join-group",
        element: (
          <ProtectedRoute>
            <JoinGroup />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/bookings",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/groups",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminGroups />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-biens",
        element: (
          <ProtectedRoute requireAdmin>
            <ManageBiens />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-groupes",
        element: (
          <ProtectedRoute requireAdmin>
            <ManageGroupes />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-type-groupes",
        element: (
          <ProtectedRoute requireAdmin>
            <ManageTypeGroupes />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/audit",
        element: (
          <ProtectedRoute requireAdmin>
            <AuditLog />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
