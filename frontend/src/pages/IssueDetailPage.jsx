import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { issuesAPI, assignmentsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const URGENCY_COLOR = { high: "#e87070", medium: "#f0a050", low: "#4ecf82" };
const TYPE_ICON = { food: "🍱", medical: "🏥", education: "📚" };

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
    } catch {
      toast.error("Delete failed");
      setDeleting(false);
    }
  };

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 28, width: 140, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
    </div>
  );

  if (!issue) return null;

  const { lat, lng } = issue.location;
  const urgencyColor = URGENCY_COLOR[issue.urgency] || "var(--accent)";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate("/issues")}
        style={{ marginBottom: 20, borderRadius: 20 }}>
        ← Back to Feed
      </button>

      {/* Post card header */}
      <div style={{
        background: "var(--bg2)", borderRadius: 20, overflow: "hidden",
        border: "1px solid var(--border)", marginBottom: 20,
      }}>
        {/* Urgency bar */}
        <div style={{ height: 5, background: urgencyColor }} />

        <div style={{ padding: "20px 24px" }}>
          {/* Author row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: `linear-gradient(135deg, ${urgencyColor} 0%, var(--accent) 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {TYPE_ICON[issue.type] || "📌"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {issue.createdBy?.name || "Community Admin"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                {new Date(issue.createdAt).toLocaleString("en-IN")}
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                background: `${urgencyColor}22`, color: urgencyColor, border: `1px solid ${urgencyColor}44`,
              }}>{issue.urgency}</span>
              <span style={{
                fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
                background: "var(--bg3)", color: "var(--text2)", border: "1px solid var(--border2)",
              }}>{issue.type}</span>
              <span className={`badge badge-${issue.status}`}>{issue.status}</span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.3 }}>
            {issue.title}
          </h1>

          {/* Description */}
          <p style={{ color: "var(--text2)", lineHeight: 1.75, margin: 0, fontSize: 15 }}>
            {issue.description}
          </p>
        </div>
      </div>

      {/* Action bar (admin) */}
      {user.role === "admin" && (
        <div style={{
          display: "flex", gap: 10, marginBottom: 20,
          padding: "14px 18px", borderRadius: 16,
          background: "var(--bg2)", border: "1px solid var(--border)",
        }}>
          {issue.status !== "completed" && (
            <button className="btn btn-primary" onClick={handleMatch} disabled={matching}
              style={{ borderRadius: 20 }}>
              {matching ? "Matching…" : "⚡ Match Volunteers"}
            </button>
          )}
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}
            style={{ borderRadius: 20, marginLeft: "auto" }}>
            {deleting ? "Deleting…" : "🗑 Delete"}
          </button>
        </div>
      )}

      {/* Two-col layout */}
      <div className="grid-2" style={{ gap: 20, alignItems: "start" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Location card — map-first */}
          <div style={{
            background: "var(--bg2)", borderRadius: 16, overflow: "hidden",
            border: "1px solid var(--border)",
          }}>
            <div style={{ padding: "14px 18px 0", fontWeight: 700, fontSize: 14 }}>
              📍 Location
            </div>
            {/* Map */}
            <div style={{ height: 240, margin: "12px 0 0" }}>
              <MapContainer center={[lat, lng]} zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false} dragging={true} zoomControl={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                  <Popup>{issue.title}</Popup>
                </Marker>
              </MapContainer>
            </div>
            {/* Coordinates + link */}
            <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono, monospace)" }}>
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </span>
              <a href={`https://maps.google.com/?q=${lat},${lng}`}
                target="_blank" rel="noreferrer"
                style={{
                  marginLeft: "auto", fontSize: 12, fontWeight: 600,
                  color: "var(--accent)", textDecoration: "none",
                }}>
                Open in Google Maps →
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div style={{
            background: "var(--bg2)", borderRadius: 16, padding: "16px 18px",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🕐 Timeline</div>
            <div style={{ display: "flex", gap: 32 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>Posted</div>
                <span style={{ fontSize: 13 }}>{new Date(issue.createdAt).toLocaleString("en-IN")}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>Updated</div>
                <span style={{ fontSize: 13 }}>{new Date(issue.updatedAt).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Volunteers (admin only) */}
        {user.role === "admin" && (
          <div style={{
            background: "var(--bg2)", borderRadius: 16, padding: "16px 18px",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
              👥 Volunteers ({assignments.length})
            </div>

            {assignments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text3)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
                <p style={{ fontSize: 14, margin: 0 }}>No volunteers yet</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Click "Match Volunteers" above</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {assignments.map(a => (
                  <div key={a._id} style={{
                    background: "var(--bg3)", borderRadius: 12,
                    padding: "12px 14px", border: "1px solid var(--border)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{a.volunteerId?.name || "Unknown"}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{a.volunteerId?.email}</div>
                      </div>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                    </div>
                    {a.verifiedByAdmin && (
                      <div style={{ fontSize: 12, color: "#4ecf82", marginTop: 6 }}>
                        ✓ Verified · {a.creditsAwarded} credits awarded
                      </div>
                    )}
                    {a.markedCompleteByVolunteer && !a.verifiedByAdmin && (
                      <button className="btn btn-primary btn-sm"
                        onClick={() => handleVerify(a._id)}
                        style={{ width: "100%", marginTop: 8, borderRadius: 20 }}>
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