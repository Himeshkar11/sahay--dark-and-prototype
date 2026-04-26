import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { issuesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LocationPicker from "../components/LocationPicker";

const EMPTY_FORM = { title: "", description: "", type: "food", urgency: "medium" };

const URGENCY_COLOR = { high: "#e87070", medium: "#f0a050", low: "#4ecf82" };
const TYPE_ICON = { food: "🍱", medical: "🏥", education: "📚" };
const STATUS_LABEL = { open: "Open", assigned: "In Progress", completed: "Done" };

function PostCard({ issue }) {
  const { user } = useAuth();
  const date = new Date(issue.createdAt);
  const timeAgo = (() => {
    const diff = (Date.now() - date) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  })();

  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Urgency strip */}
      <div style={{ height: 4, background: URGENCY_COLOR[issue.urgency] || "var(--border2)" }} />

      <div style={{ padding: "16px 20px" }}>
        {/* Post header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          {/* Avatar */}
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: `linear-gradient(135deg, ${URGENCY_COLOR[issue.urgency] || "var(--accent)"} 0%, var(--accent) 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
          }}>
            {TYPE_ICON[issue.type] || "📌"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
              {issue.createdBy?.name || "Community Admin"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{timeAgo}</div>
          </div>
          {/* Status pill */}
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 10px",
            borderRadius: 20, flexShrink: 0,
            background: issue.status === "completed" ? "rgba(78,207,130,0.15)" :
              issue.status === "assigned" ? "rgba(240,160,80,0.15)" : "rgba(120,120,180,0.15)",
            color: issue.status === "completed" ? "#4ecf82" :
              issue.status === "assigned" ? "#f0a050" : "var(--text2)",
          }}>
            {STATUS_LABEL[issue.status] || issue.status}
          </span>
        </div>

        {/* Body */}
        <Link to={`/issues/${issue._id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: "var(--text)", lineHeight: 1.3 }}>
            {issue.title}
          </div>
          <p style={{
            color: "var(--text2)", fontSize: 14, lineHeight: 1.6, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {issue.description}
          </p>
        </Link>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
            background: `${URGENCY_COLOR[issue.urgency]}22`,
            color: URGENCY_COLOR[issue.urgency],
            border: `1px solid ${URGENCY_COLOR[issue.urgency]}44`,
          }}>
            {issue.urgency} urgency
          </span>
          <span style={{
            fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20,
            background: "var(--bg3)", color: "var(--text2)",
            border: "1px solid var(--border2)",
          }}>
            {TYPE_ICON[issue.type]} {issue.type}
          </span>

          <span style={{ flex: 1 }} />

          {/* Help button */}
          {issue.status !== "completed" && (
            <Link
              to={`/issues/${issue._id}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 600, padding: "5px 13px", borderRadius: 20,
                background: "var(--accent)", color: "var(--bg)",
                textDecoration: "none", border: "none", cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              🤝 I will help
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IssuesPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ status: "", type: "", urgency: "" });

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.urgency) params.urgency = filters.urgency;
      const { data } = await issuesAPI.getAll(params);
      setIssues(data);
    } catch {
      toast.error("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!location) { toast.error("Please select a location on the map"); return; }
    setSubmitting(true);
    try {
      await issuesAPI.create({ ...form, location: { lat: location.lat, lng: location.lng } });
      toast.success("Issue posted!");
      setShowModal(false);
      setForm(EMPTY_FORM);
      setLocation(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create issue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => { setShowModal(false); setForm(EMPTY_FORM); setLocation(null); };
  const setField = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); };

  const activeFilters = filters.status || filters.type || filters.urgency;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "var(--text)" }}>Community Feed</h1>
          <p style={{ fontSize: 13, color: "var(--text3)", margin: "4px 0 0" }}>
            {issues.length} active issue{issues.length !== 1 ? "s" : ""} in your area
          </p>
        </div>
        {user?.role === "admin" && (
          <button
            className="btn btn-primary"
            style={{ borderRadius: 20, fontWeight: 700 }}
            onClick={() => setShowModal(true)}
          >
            + Post Issue
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {[
          { key: "status", options: ["open", "assigned", "completed"], label: "Status" },
          { key: "type", options: ["food", "medical", "education"], label: "Type" },
          { key: "urgency", options: ["high", "medium", "low"], label: "Urgency" },
        ].map(({ key, options, label }) => (
          <select
            key={key}
            value={filters[key]}
            onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
            style={{
              fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20,
              border: filters[key] ? "1px solid var(--accent)" : "1px solid var(--border2)",
              background: filters[key] ? "rgba(var(--accent-rgb,100,100,255),0.08)" : "var(--bg2)",
              color: filters[key] ? "var(--accent)" : "var(--text2)",
              cursor: "pointer", outline: "none",
            }}
          >
            <option value="">All {label}s</option>
            {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        ))}
        {activeFilters && (
          <button
            onClick={() => setFilters({ status: "", type: "", urgency: "" })}
            style={{
              fontSize: 12, padding: "5px 12px", borderRadius: 20,
              border: "1px solid var(--border2)", background: "transparent",
              color: "var(--text3)", cursor: "pointer",
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "var(--bg2)", borderRadius: 16, border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
          <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>No issues found</p>
          <p style={{ color: "var(--text3)", fontSize: 14 }}>Try changing filters or check back later</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {issues.map(issue => <PostCard key={issue._id} issue={issue} />)}
        </div>
      )}

      {/* Create Issue Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={e => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="modal-box" style={{ maxWidth: 580, width: "100%", borderRadius: 20 }}>
            <div className="modal-header">
              <span className="modal-title">📢 Post a New Issue</span>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" name="title" placeholder="Brief description of the issue"
                  value={form.title} onChange={setField} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="description" placeholder="Detailed explanation..."
                  value={form.description} onChange={setField} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" name="type" value={form.type} onChange={setField}>
                    <option value="food">🍱 Food</option>
                    <option value="medical">🏥 Medical</option>
                    <option value="education">📚 Education</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select className="form-select" name="urgency" value={form.urgency} onChange={setField}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <LocationPicker location={location} setLocation={setLocation} height="240px" label="Issue Location *" />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ borderRadius: 20 }}>
                  {submitting ? "Posting…" : "Post Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}