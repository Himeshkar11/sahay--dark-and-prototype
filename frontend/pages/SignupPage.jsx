import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", role: "donor" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password, form.role);
      toast.success(`Welcome, ${user.name}! Account created.`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
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
          Join the platform and make a difference
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name="name" placeholder="Arjun Kumar" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">I want to join as</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="donor">Donor — I want to contribute funds</option>
              <option value="volunteer">Volunteer — I want to work on the ground</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div className="divider" />

        <p className="text-sm text-muted" style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}