// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`sidebar-link ${location.pathname === to ? "active" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <h2 className="logo">
          Sahay<span className="logo-dot">.</span>
        </h2>
        <p className="sidebar-sub">NGO Platform</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItem("/dashboard", "Dashboard")}
        {navItem("/issues", "Issues")}
        {navItem("/map", "Map")}
        {user?.role !== "admin" && navItem("/volunteer", "My Work")}
        {user?.role !== "admin" && navItem("/donate", "Contribute")}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-footer">
        {/* Theme toggle sits above user info */}
        <ThemeToggle />

        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role}</span>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
