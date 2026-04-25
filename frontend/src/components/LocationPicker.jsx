import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Default center: Tirupati, Andhra Pradesh
const DEFAULT_CENTER = [13.6288, 79.4192];
const DEFAULT_ZOOM = 13;

/**
 * Internal click handler — lives inside MapContainer so it has map context.
 */
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPick({ lat, lng });
    },
  });
  return null;
}

/**
 * LocationPicker
 *
 * Props:
 *   location   — { lat, lng } | null  — current selected location (controlled)
 *   setLocation — ({ lat, lng }) => void — called when user clicks the map
 *   height     — CSS string, default "300px"
 *   label      — optional label string shown above the map
 */
export default function LocationPicker({
  location,
  setLocation,
  height = "300px",
  label = "Select Location on Map",
}) {
  const center = location
    ? [location.lat, location.lng]
    : DEFAULT_CENTER;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label className="form-label">{label}</label>}

      {/* Instruction banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          background: "var(--bg3, #f5f5f5)",
          border: "1px solid var(--border, #ddd)",
          borderRadius: "var(--radius, 6px)",
          fontSize: 13,
          color: "var(--text2, #555)",
          marginBottom: 4,
        }}
      >
        <span>📍</span>
        <span>Click anywhere on the map to pin the issue location</span>
      </div>

      {/* Map */}
      <div
        style={{
          height,
          borderRadius: "var(--radius, 6px)",
          overflow: "hidden",
          border: location
            ? "2px solid var(--primary, #3b82f6)"
            : "1px solid var(--border, #ddd)",
          transition: "border-color 0.2s",
        }}
      >
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={setLocation} />
          {location && (
            <Marker position={[location.lat, location.lng]} />
          )}
        </MapContainer>
      </div>

      {/* Coordinate readout */}
      {location ? (
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "8px 12px",
            background: "var(--bg3, #f5f5f5)",
            borderRadius: "var(--radius, 6px)",
            border: "1px solid var(--border, #ddd)",
            fontSize: 13,
          }}
        >
          <span>
            <span style={{ color: "var(--text2, #888)", marginRight: 4 }}>Lat:</span>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
              {location.lat.toFixed(6)}
            </span>
          </span>
          <span>
            <span style={{ color: "var(--text2, #888)", marginRight: 4 }}>Lng:</span>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
              {location.lng.toFixed(6)}
            </span>
          </span>
          <button
            type="button"
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text2, #888)",
              fontSize: 12,
              padding: 0,
            }}
            onClick={() => setLocation(null)}
          >
            ✕ Clear
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: "7px 12px",
            fontSize: 13,
            color: "var(--text-muted, #aaa)",
            fontStyle: "italic",
          }}
        >
          No location selected
        </div>
      )}
    </div>
  );
}