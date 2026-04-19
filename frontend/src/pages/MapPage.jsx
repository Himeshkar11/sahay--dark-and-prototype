import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { issuesAPI } from "../services/api";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

const URGENCY_COLOR = {
  high:   "#e87070",
  medium: "#e8c547",
  low:    "#4ecf82",
};

export default function MapPage() {
  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    issuesAPI.getAll()
      .then(({ data }) => setIssues(data))
      .catch(() => toast.error("Failed to load issues"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? issues : issues.filter(i => i.urgency === filter || i.status === filter);
  const center   = issues.length
    ? [
        issues.reduce((s, i) => s + i.location.lat, 0) / issues.length,
        issues.reduce((s, i) => s + i.location.lng, 0) / issues.length,
      ]
    : [13.0827, 80.2707]; // Default: Chennai

  return (
    <div>
      <div className="flex items-center justify-between mb-24">
        <div>
          <h1 className="page-title">Map View</h1>
          <p className="page-subtitle">{filtered.length} issues visible</p>
        </div>
        <div className="flex gap-8">
          {["all", "high", "medium", "low", "open", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-16 mb-16" style={{ alignItems: "center" }}>
        <span className="text-xs text-muted" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Urgency:
        </span>
        {Object.entries(URGENCY_COLOR).map(([u, c]) => (
          <div key={u} className="flex items-center gap-8">
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            <span className="text-xs text-muted">{u}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 500, borderRadius: 12 }} />
      ) : (
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: 540, width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((issue) => (
              <CircleMarker
                key={issue._id}
                center={[issue.location.lat, issue.location.lng]}
                radius={issue.urgency === "high" ? 14 : issue.urgency === "medium" ? 10 : 8}
                pathOptions={{
                  fillColor:   URGENCY_COLOR[issue.urgency],
                  color:       URGENCY_COLOR[issue.urgency],
                  fillOpacity: 0.75,
                  weight:      2,
                  opacity:     1,
                }}
              >
                <Popup>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 180 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>
                      {issue.title}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{
                        background: URGENCY_COLOR[issue.urgency] + "33",
                        color: URGENCY_COLOR[issue.urgency],
                        padding: "2px 8px", borderRadius: 100,
                        fontSize: 10, fontWeight: 700, textTransform: "uppercase"
                      }}>{issue.urgency}</span>
                      <span style={{
                        background: "#2a2a2a", color: "#9a9690",
                        padding: "2px 8px", borderRadius: 100,
                        fontSize: 10, textTransform: "uppercase"
                      }}>{issue.type}</span>
                      <span style={{
                        background: "#2a2a2a", color: "#9a9690",
                        padding: "2px 8px", borderRadius: 100,
                        fontSize: 10, textTransform: "uppercase"
                      }}>{issue.status}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#666", marginBottom: 8, lineHeight: 1.5 }}>
                      {issue.description.slice(0, 100)}
                      {issue.description.length > 100 ? "…" : ""}
                    </p>
                    <a
                      href={`/issues/${issue._id}`}
                      style={{ color: "#e8c547", fontSize: 12, fontWeight: 600 }}
                    >
                      View Details →
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Issues List below map */}
      <div className="mt-auto" style={{ marginTop: 32 }}>
        <h2 className="section-title" style={{ marginBottom: 12 }}>Issues on Map</h2>
        <div className="grid-3" style={{ gap: 12 }}>
          {filtered.map((issue) => (
            <Link key={issue._id} to={`/issues/${issue._id}`}>
              <div className={`issue-card ${issue.urgency}`} style={{ padding: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{issue.title}</div>
                <div className="flex gap-8">
                  <span className={`badge badge-${issue.urgency}`}>{issue.urgency}</span>
                  <span className={`badge badge-${issue.status}`}>{issue.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}