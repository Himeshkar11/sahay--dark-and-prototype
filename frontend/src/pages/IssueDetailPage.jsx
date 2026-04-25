import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { issuesAPI, assignmentsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Fix default Leaflet marker icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function IssueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadIssue = async () => {
    try {
      const { data } = await issuesAPI.getById(id);
      setIssue(data);
    } catch {
      toast.error("Issue not found");
      navigate("/issues");
    }
  };

  const loadAssignments = async () => {
    if (user.role !== "admin") return;
    try {
      const { data } = await assignmentsAPI.getForIssue(id);
      setAssignments(data);
    } catch {}
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadIssue();
      await loadAssignments();
      setLoading(false);
    };
    init();
  }, [id]);

  const handleMatch = async () => {
    setMatching(true);
    try {
      const { data } = await issuesAPI.matchAndAssign(id);
      toast.success(data.message);
      await loadIssue();
      await loadAssignments();
    } catch (e) {
      toast.error(e.response?.data?.message || "Matching failed");
    } finally {
      setMatching(false);
    }
  };

  const handleVerify = async (assignmentId) => {
    try {
      await assignmentsAPI.verifyAndCredit(assignmentId, { creditsToAward: 10 });
      toast.success("Verified! 10 credits awarded.");
      await loadAssignments();
      await loadIssue();
    } catch (e) {
      toast.error(e.response?.data?.message || "Verification failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this issue? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await issuesAPI.delete(id);
      toast.success("Issue deleted");
      navigate("/issues");
    } catch (e) {
      toast.error("Delete failed");
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div>
        <div className="skeleton" style={{ height: 28, width: 140, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 48, width: 320, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 120 }} />
      </div>
    );

  if (!issue) return null;

  const { lat, lng } = issue.location;

  return (
    <div>
      {/* Breadcrumb */}
      <button className="btn btn-ghost btn-sm mb-24" onClick={() => navigate("/issues")}>
        ← Back to Issues
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-24">
        <div>
          <div className="flex gap-8 mb-8" style={{ alignItems: "center" }}>
            <span className={`badge badge-${issue.urgency}`}>{issue.urgency} urgency</span>
            <span className={`badge badge-${issue.type}`}>{issue.type}</span>
            <span className={`badge badge-${issue.status}`}>{issue.status}</span>
          </div>
          <h1 className="page-title">{issue.title}</h1>
        </div>

        {user.role === "admin" && (
          <div className="flex gap-8">
            {issue.status !== "completed" && (
              <button
                className="btn btn-primary"
                onClick={handleMatch}
                disabled={matching}
              >
                {matching ? "Matching…" : "⚡ Match Volunteers"}
              </button>
            )}
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* DESCRIPTION */}
          <div className="card">
            <h3 className="section-title">Description</h3>
            <p style={{ color: "var(--text2)", lineHeight: 1.7 }}>
              {issue.description}
            </p>
          </div>

          {/* LOCATION CARD — map replaces raw coordinate display */}
          <div className="card">
            <h3 className="section-title">Location</h3>

            {/* Embedded map */}
            <div
              style={{
                height: 250,
                borderRadius: "var(--radius, 6px)",
                overflow: "hidden",
                border: "1px solid var(--border, #ddd)",
                marginBottom: 12,
              }}
            >
              <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                dragging={true}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                  <Popup>{issue.title}</Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Coordinate readout (compact, below map) */}
            <div
              style={{
                display: "flex",
                gap: 16,
                padding: "8px 12px",
                background: "var(--bg3, #f5f5f5)",
                borderRadius: "var(--radius, 6px)",
                border: "1px solid var(--border, #ddd)",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              <span>
                <span style={{ color: "var(--text2)", marginRight: 4 }}>Lat:</span>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
                  {lat.toFixed(6)}
                </span>
              </span>
              <span>
                <span style={{ color: "var(--text2)", marginRight: 4 }}>Lng:</span>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
                  {lng.toFixed(6)}
                </span>
              </span>
            </div>

            {/* Open in Google Maps */}
            <a
              href={`https://maps.google.com/?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Open in Google Maps →
            </a>
          </div>

          {/* TIMELINE */}
          <div className="card">
            <h3 className="section-title">Timeline</h3>
            <div className="flex gap-24">
              <div>
                <div className="form-label">Created</div>
                <span className="text-sm">
                  {new Date(issue.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <div className="form-label">Last Updated</div>
                <span className="text-sm">
                  {new Date(issue.updatedAt).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        {user.role === "admin" && (
          <div className="card">
            <h3 className="section-title">
              Assigned Volunteers ({assignments.length})
            </h3>

            {assignments.length === 0 ? (
              <div className="empty-state" style={{ padding: "30px 0" }}>
                <div className="empty-icon" style={{ fontSize: 28 }}>✦</div>
                <p className="empty-text">No volunteers assigned yet</p>
                <p className="empty-sub">Click "Match Volunteers" to auto-assign</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {assignments.map((a) => (
                  <div
                    key={a._id}
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      padding: "14px 16px",
                    }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>
                          {a.volunteerId?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-muted">
                          {a.volunteerId?.email}
                        </div>
                      </div>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                    </div>

                    {a.markedCompleteByVolunteer && !a.verifiedByAdmin && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleVerify(a._id)}
                        style={{ width: "100%" }}
                      >
                        ✓ Verify & Award 10 Credits
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}