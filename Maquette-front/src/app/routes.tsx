import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Catalog } from "./components/Catalog";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { BookingForm } from "./components/BookingForm";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuditLog } from "./components/AuditLog";
import { AdminGroups } from "./components/AdminGroups";
import { AdminBookings } from "./components/AdminBookings";
import { AdminUsers } from "./components/AdminUsers";
import { GroupPendingRequests } from "./components/GroupPendingRequests";
import { MyBookings } from "./components/MyBookings";
import { PropertyDetail } from "./components/PropertyDetail";
import { UserProfile } from "./components/UserProfile";
import { BookingDetail } from "./components/BookingDetail";
import { NotFound } from "./components/NotFound";
import { JoinGroup } from "./components/JoinGroup";
import { MyGroups } from "./components/MyGroups";
import { GroupManagement } from "./components/GroupManagement";
import { Logout } from "./components/Logout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "catalog", Component: Catalog },
      { path: "property/:resourceId", Component: PropertyDetail },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", Component: Dashboard },
      { path: "profile", Component: UserProfile },
      { path: "booking/:resourceId", Component: BookingForm },
      { path: "booking-detail/:bookingId", Component: BookingDetail },
      { path: "my-bookings", Component: MyBookings },
      { path: "join-group", Component: JoinGroup },
      { path: "my-groups", Component: MyGroups },
      { path: "my-groups/pending", Component: GroupPendingRequests },
      { path: "groups/:groupId/manage", Component: GroupManagement },
      { path: "logout", Component: Logout },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/audit", Component: AuditLog },
      { path: "admin/bookings", Component: AdminBookings },
      { path: "admin/users", Component: AdminUsers },
      { path: "admin/groups", Component: AdminGroups },
      { path: "*", Component: NotFound },
    ],
  },
]);
