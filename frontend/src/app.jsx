// src/app.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";

// Pages
import LandingPage     from "./pages/landing";
import LoginPage       from "./pages/LoginPage";
import SignupPage      from "./pages/SignupPage";
import DashboardPage   from "./pages/DashboardPage";
import IssuesPage      from "./pages/IssuesPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import VolunteerPanel  from "./pages/VolunteerPanel";
import MapPage         from "./pages/MapPage";
import DonationPage    from "./pages/DonationPage";

import "./index.css";

// ── Theme bootstrap ───────────────────────────────────────────────────────────
(function initTheme() {
  try {
    const saved       = localStorage.getItem("sahay-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark      = saved !== null ? saved === "dark" : prefersDark;
    document.body.classList.add(isDark ? "dark" : "light");
  } catch (_) {
    document.body.classList.add("dark");
  }
})();

// ── Route Guards ──────────────────────────────────────────────────────────────

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, color: "var(--text2)" }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/feed" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  // Logged-in users go straight to the feed
  if (user) return <Navigate to="/feed" replace />;
  return children;
};

// ── Layouts ───────────────────────────────────────────────────────────────────

const AppLayout = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

const AuthLayout = ({ children }) => (
  <div style={{ position: "relative" }}>
    <div className="auth-theme-toggle">
      <ThemeToggle />
    </div>
    {children}
  </div>
);

// ── Routes ────────────────────────────────────────────────────────────────────

const AppRoutes = () => (
  <Routes>
    {/* Marketing landing for logged-out visitors */}
    <Route path="/" element={<LandingPage />} />

    {/* Auth pages */}
    <Route path="/login" element={
      <PublicRoute><AuthLayout><LoginPage /></AuthLayout></PublicRoute>
    } />
    <Route path="/signup" element={
      <PublicRoute><AuthLayout><SignupPage /></AuthLayout></PublicRoute>
    } />

    {/* ── Home feed (social-style issues list) ── */}
    <Route path="/feed" element={
      <PrivateRoute><AppLayout><IssuesPage /></AppLayout></PrivateRoute>
    } />

    {/* Keep /issues as an alias so old links don't break */}
    <Route path="/issues" element={<Navigate to="/feed" replace />} />

    <Route path="/issues/:id" element={
      <PrivateRoute><AppLayout><IssueDetailPage /></AppLayout></PrivateRoute>
    } />

    {/* Dashboard still works as secondary overview */}
    <Route path="/dashboard" element={
      <PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>
    } />

    {/* Volunteer profile page */}
    <Route path="/volunteer" element={
      <PrivateRoute roles={["volunteer"]}><AppLayout><VolunteerPanel /></AppLayout></PrivateRoute>
    } />

    <Route path="/map" element={
      <PrivateRoute><AppLayout><MapPage /></AppLayout></PrivateRoute>
    } />

    <Route path="/donate" element={
      <PrivateRoute><AppLayout><DonationPage /></AppLayout></PrivateRoute>
    } />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// ── Main App ──────────────────────────────────────────────────────────────────

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
              boxShadow: "var(--shadow-md)",
            },
            success: { iconTheme: { primary: "#4ecf82", secondary: "var(--bg2)" } },
            error:   { iconTheme: { primary: "#e87070", secondary: "var(--bg2)" } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}