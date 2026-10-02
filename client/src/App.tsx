import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import BusinessForm from "./pages/BusinessForm";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Links from "./pages/Links";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/PublicProfile";
import QrCode from "./pages/QrCode";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="business/new" element={<BusinessForm mode="create" />} />
        <Route path="business/edit" element={<BusinessForm mode="edit" />} />
        <Route path="links" element={<Links />} />
        <Route path="qr" element={<QrCode />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/p/:slug" element={<PublicProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
