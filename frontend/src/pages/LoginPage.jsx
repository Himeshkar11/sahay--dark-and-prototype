import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          Sahay<span>.</span>
        </div>
        <p className="auth-tagline">
          Sign in to continue to the platform
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div className="divider" />

        <p className="text-sm text-muted" style={{ textAlign: "center" }}>
          New to Sahay?{" "}
          <Link to="/signup" style={{ color: "var(--accent)" }}>
            Create an account
          </Link>
        </p>

        <div style={{ marginTop: 24, padding: 14, background: "var(--bg3)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
          <p className="text-xs text-muted" style={{ marginBottom: 6, fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase" }}>
            Admin Access
          </p>
          <p className="text-xs text-muted">
            Use your designated admin email to get admin role automatically on signup.
          </p>
        </div>
      </div>
    </div>
  );
}