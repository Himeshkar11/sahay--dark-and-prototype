import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { issuesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LocationPicker from "../components/LocationPicker";

const EMPTY_FORM = { title: "", description: "", type: "food", urgency: "medium" };

export default function IssuesPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [location, setLocation] = useState(null); // { lat, lng } | null
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ status: "", type: "", urgency: "" });

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status)  params.status  = filters.status;
      if (filters.type)    params.type    = filters.type;
      if (filters.urgency) params.urgency = filters.urgency;
      const { data } = await issuesAPI.getAll(params);
      setIssues(data);
    } catch (e) {
      toast.error("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error("Please select a location on the map");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        location: { lat: location.lat, lng: location.lng },
      };
      await issuesAPI.create(payload);
      toast.success("Issue created!");
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

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setLocation(null);
  };

  const setField = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-24">
        <div>
          <h1 className="page-title">Issues</h1>
          <p className="page-subtitle">
            {issues.length} issue{issues.length !== 1 ? "s" : ""} found
          </p>
        </div>
        {user.role === "admin" && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Issue
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-8 mb-24" style={{ flexWrap: "wrap" }}>
        {[
          { key: "status",  options: ["", "open", "assigned", "completed"], label: "Status" },
          { key: "type",    options: ["", "food", "medical", "education"],  label: "Type" },
          { key: "urgency", options: ["", "high", "medium", "low"],         label: "Urgency" },
        ].map(({ key, options, label }) => (
          <select
            key={key}
            className="form-select"
            style={{ width: "auto", minWidth: 140 }}
            value={filters[key]}
            onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.value }))}
          >
            <option value="">All {label}s</option>
            {options.filter(Boolean).map((o) => (
              <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        ))}
        {(filters.status || filters.type || filters.urgency) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFilters({ status: "", type: "", urgency: "" })}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Issue List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100 }} />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">⊞</div>
            <p className="empty-text">No issues found</p>
            <p className="empty-sub">Try changing filters or check back later</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {issues.map((issue) => (
            <Link key={issue._id} to={`/issues/${issue._id}`}>
              <div className={`issue-card ${issue.urgency}`}>
                <div className="issue-card-header">
                  <span className="issue-title">{issue.title}</span>
                  <span className={`badge badge-${issue.status}`}>{issue.status}</span>
                </div>
                <p
                  className="text-sm text-muted"
                  style={{
                    marginBottom: 0,
                    WebkitLineClamp: 2,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {issue.description}
                </p>
                <div className="issue-meta">
                  <span className={`badge badge-${issue.urgency}`}>{issue.urgency}</span>
                  <span className={`badge badge-${issue.type}`}>{issue.type}</span>
                  <span
                    className="text-xs text-muted"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
                  </span>
                  <span className="text-xs text-muted" style={{ marginLeft: "auto" }}>
                    {new Date(issue.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Issue Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="modal-box" style={{ maxWidth: 580, width: "100%" }}>
            <div className="modal-header">
              <span className="modal-title">Create New Issue</span>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  name="title"
                  placeholder="Brief description of the issue"
                  value={form.title}
                  onChange={setField}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  placeholder="Detailed explanation..."
                  value={form.description}
                  onChange={setField}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={form.type}
                    onChange={setField}
                  >
                    <option value="food">Food</option>
                    <option value="medical">Medical</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select
                    className="form-select"
                    name="urgency"
                    value={form.urgency}
                    onChange={setField}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Map-based location picker — replaces manual lat/lng inputs */}
              <div className="form-group">
                <LocationPicker
                  location={location}
                  setLocation={setLocation}
                  height="260px"
                  label="Issue Location *"
                />
              </div>

              <div className="flex gap-8" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Creating…" : "Create Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}