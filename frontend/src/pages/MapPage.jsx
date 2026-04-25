import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from "react-leaflet";
import { issuesAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

// 🔥 FIX marker icon issue
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const URGENCY_COLOR = {
  high: "#e87070",
  medium: "#e8c547",
  low: "#4ecf82",
};

export default function MapPage() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  // 📏 Distance function
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // 📍 Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }, []);

  // 🔄 Fetch issues
  useEffect(() => {
    issuesAPI.getAll()
      .then(({ data }) => setIssues(data))
      .catch(() => toast.error("Failed to load issues"))
      .finally(() => setLoading(false));
  }, []);

  // 🎯 Filter + Sort
  let filtered =
    filter === "all"
      ? issues
      : issues.filter(
          (i) => i.urgency === filter || i.status === filter
        );

  if (userLocation) {
    filtered = filtered
      .map((issue) => ({
        ...issue,
        distance: getDistance(
          userLocation[0],
          userLocation[1],
          issue.location.lat,
          issue.location.lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  const nearest = filtered[0];

  // 🎯 Center logic
  const center = userLocation
    ? userLocation
    : issues.length
    ? [
        issues.reduce((s, i) => s + i.location.lat, 0) / issues.length,
        issues.reduce((s, i) => s + i.location.lng, 0) / issues.length,
      ]
    : [13.0827, 80.2707];

  return (
    <div>
      {/* Header */}
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
              className={`btn btn-sm ${
                filter === f ? "btn-primary" : "btn-ghost"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* MAP */}
      {loading ? (
        <div className="skeleton" style={{ height: 500, borderRadius: 12 }} />
      ) : (
        <div style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)"
        }}>
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: 540, width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 📍 USER LOCATION */}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>You are here 📍</Popup>
              </Marker>
            )}

            {/* 🔥 ISSUE MARKERS */}
            {filtered.map((issue) => (
              <CircleMarker
                key={issue._id}
                center={[issue.location.lat, issue.location.lng]}
                radius={
                  issue.urgency === "high"
                    ? 14
                    : issue.urgency === "medium"
                    ? 10
                    : 8
                }
                pathOptions={{
                  fillColor: URGENCY_COLOR[issue.urgency],
                  color: URGENCY_COLOR[issue.urgency],
                  fillOpacity: 0.75,
                  weight: issue._id === nearest?._id ? 4 : 2,
                }}
                eventHandlers={{
                  click: () => navigate(`/issues/${issue._id}`),
                }}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong>{issue.title}</strong>
                    <br />

                    {userLocation && (
                      <div style={{ fontSize: 12, marginTop: 6 }}>
                        📏 {issue.distance?.toFixed(2)} km away
                      </div>
                    )}

                    {issue._id === nearest?._id && (
                      <div style={{ color: "gold", fontSize: 12 }}>
                        ⭐ Nearest Issue
                      </div>
                    )}

                    <br />
                    <Link to={`/issues/${issue._id}`}>
                      View Details →
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* LIST */}
      <div style={{ marginTop: 32 }}>
        <h2 className="section-title">Issues on Map</h2>

        <div className="grid-3" style={{ gap: 12 }}>
          {filtered.map((issue) => (
            <Link key={issue._id} to={`/issues/${issue._id}`}>
              <div className={`issue-card ${issue.urgency}`}>
                <div style={{ fontWeight: 600 }}>
                  {issue.title}
                  {issue._id === nearest?._id && " ⭐"}
                </div>

                <div className="flex gap-8">
                  <span className={`badge badge-${issue.urgency}`}>
                    {issue.urgency}
                  </span>
                  <span className={`badge badge-${issue.status}`}>
                    {issue.status}
                  </span>
                </div>

                {userLocation && (
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    📏 {issue.distance?.toFixed(2)} km
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}