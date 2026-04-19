import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import IssuesPage from "./pages/IssuesPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import VolunteerPanel from "./pages/VolunteerPanel";
import MapPage from "./pages/MapPage";
import DonationPage from "./pages/DonationPage";
import "./index.css";

// Route guards
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, color: "var(--text2)" }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Layout wrapper (sidebar + content)
const AppLayout = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    <Route path="/login"  element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

    <Route path="/dashboard" element={
      <PrivateRoute>
        <AppLayout><DashboardPage /></AppLayout>
      </PrivateRoute>
    }/>

    <Route path="/issues" element={
      <PrivateRoute>
        <AppLayout><IssuesPage /></AppLayout>
      </PrivateRoute>
    }/>

    <Route path="/issues/:id" element={
      <PrivateRoute>
        <AppLayout><IssueDetailPage /></AppLayout>
      </PrivateRoute>
    }/>

    <Route path="/volunteer" element={
      <PrivateRoute roles={["volunteer"]}>
        <AppLayout><VolunteerPanel /></AppLayout>
      </PrivateRoute>
    }/>

    <Route path="/map" element={
      <PrivateRoute>
        <AppLayout><MapPage /></AppLayout>
      </PrivateRoute>
    }/>

    <Route path="/donate" element={
      <PrivateRoute>
        <AppLayout><DonationPage /></AppLayout>
      </PrivateRoute>
    }/>
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg2)",
              color: "var(--text)",
              border: "1px solid var(--border2)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#4ecf82", secondary: "#0a0a0a" } },
            error:   { iconTheme: { primary: "#e87070", secondary: "#0a0a0a" } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}