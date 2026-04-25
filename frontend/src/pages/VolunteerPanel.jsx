import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { assignmentsAPI, usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LocationPicker from "../components/LocationPicker";

// Fix default Leaflet marker icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function VolunteerPanel() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Location stored as { lat, lng } | null — mirrors LocationPicker's contract
  const [profileForm, setProfileForm] = useState({
    skills: [],
    availability: false,
    location: null,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [aRes, pRes] = await Promise.all([
        assignmentsAPI.getMine(),
        usersAPI.getProfile(),
      ]);
      setAssignments(aRes.data);
      setProfile(pRes.data);

      const existingLat = pRes.data.location?.lat;
      const existingLng = pRes.data.location?.lng;

      setProfileForm({
        skills: pRes.data.skills || [],
        availability: pRes.data.availability || false,
        // Pre-fill picker with existing location if present
        location:
          existingLat && existingLng
            ? { lat: existingLat, lng: existingLng }
            : null,
      });
    } catch (e) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleMarkComplete = async (id) => {
    try {
      await assignmentsAPI.markComplete(id);
      toast.success("Marked as complete! Awaiting admin verification.");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    }
  };

  const toggleSkill = (skill) => {
    setProfileForm((p) => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter((s) => s !== skill)
        : [...p.skills, skill],
    }));
  };

  const handleCancelEdit = () => {
    // Reset form back to persisted profile values
    const existingLat = profile?.location?.lat;
    const existingLng = profile?.location?.lng;
    setProfileForm({
      skills: profile?.skills || [],
      availability: profile?.availability || false,
      location:
        existingLat && existingLng
          ? { lat: existingLat, lng: existingLng }
          : null,
    });
    setEditing(false);
  };

  const saveProfile = async () => {
    if (!profileForm.location) {
      toast.error("Please select a location");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        skills: profileForm.skills,
        availability: profileForm.availability,
        location: {
          lat: profileForm.location.lat,
          lng: profileForm.location.lng,
        },
      };
      await usersAPI.updateProfile(payload);
      toast.success("Profile updated!");
      setEditing(false);
      load();
    } catch (e) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div>
        <div className="skeleton" style={{ height: 36, width: 220, marginBottom: 32 }} />
        <div className="grid-2" style={{ gap: 24 }}>
          <div className="skeleton" style={{ height: 200 }} />
          <div className="skeleton" style={{ height: 200 }} />
        </div>
      </div>
    );

  const viewLat = profile?.location?.lat;
  const viewLng = profile?.location?.lng;
  const hasLocation = Boolean(viewLat && viewLng);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-title">Volunteer Panel</h1>
        <div className="flex gap-8 items-center">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)" }}>
            ◆ {profile?.credits || 0} credits
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={editing ? handleCancelEdit : () => setEditing(true)}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>
      <p className="page-subtitle">Manage your assignments and profile</p>

      <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
        {/* Profile Card */}
        <div className="card">
          <h3 className="section-title">My Profile</h3>

          {!editing ? (
            /* ── VIEW MODE ── */
            <div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <div className="form-label">Skills</div>
                <div className="flex gap-8" style={{ flexWrap: "wrap", marginTop: 4 }}>
                  {profile?.skills?.length ? (
                    profile.skills.map((s) => (
                      <span key={s} className={`badge badge-${s}`}>{s}</span>
                    ))
                  ) : (
                    <span className="text-sm text-muted">No skills set</span>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <div className="form-label">Availability</div>
                <span className={`badge ${profile?.availability ? "badge-completed" : "badge-medium"}`}>
                  {profile?.availability ? "Available" : "Not Available"}
                </span>
              </div>

              {/* Location — map preview or fallback */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div className="form-label">Location</div>
                {hasLocation ? (
                  <div style={{ marginTop: 6 }}>
                    {/* Small map preview */}
                    <div
                      style={{
                        height: 180,
                        borderRadius: "var(--radius, 6px)",
                        overflow: "hidden",
                        border: "1px solid var(--border, #ddd)",
                        marginBottom: 8,
                      }}
                    >
                      <MapContainer
                        center={[viewLat, viewLng]}
                        zoom={14}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                        dragging={false}
                        zoomControl={false}
                        attributionControl={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[viewLat, viewLng]} />
                      </MapContainer>
                    </div>
                    {/* Coordinate readout */}
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        padding: "7px 11px",
                        background: "var(--bg3, #f5f5f5)",
                        borderRadius: "var(--radius, 6px)",
                        border: "1px solid var(--border, #ddd)",
                        fontSize: 12,
                      }}
                    >
                      <span>
                        <span style={{ color: "var(--text2)", marginRight: 4 }}>Lat:</span>
                        <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
                          {viewLat.toFixed(6)}
                        </span>
                      </span>
                      <span>
                        <span style={{ color: "var(--text2)", marginRight: 4 }}>Lng:</span>
                        <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
                          {viewLng.toFixed(6)}
                        </span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted">No location set</span>
                )}
              </div>
            </div>
          ) : (
            /* ── EDIT MODE ── */
            <div>
              <div className="form-group">
                <label className="form-label">Skills (select all that apply)</label>
                <div className="flex gap-8" style={{ marginTop: 4 }}>
                  {["food", "medical", "education"].map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`badge ${profileForm.skills.includes(skill) ? `badge-${skill}` : ""}`}
                      style={{
                        cursor: "pointer",
                        background: profileForm.skills.includes(skill) ? undefined : "var(--bg3)",
                        color: profileForm.skills.includes(skill) ? undefined : "var(--text3)",
                        border: profileForm.skills.includes(skill) ? undefined : "1px solid var(--border2)",
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Available for assignments?</label>
                <div className="flex items-center gap-8" style={{ marginTop: 4 }}>
                  <input
                    type="checkbox"
                    id="avail"
                    checked={profileForm.availability}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, availability: e.target.checked }))
                    }
                    style={{ width: 16, height: 16, accentColor: "var(--accent)" }}
                  />
                  <label htmlFor="avail" className="text-sm">
                    {profileForm.availability ? "Yes, I'm available" : "Not available right now"}
                  </label>
                </div>
              </div>

              {/* Map-based location picker — replaces manual lat/lng inputs */}
              <div className="form-group">
                <LocationPicker
                  location={profileForm.location}
                  setLocation={(loc) =>
                    setProfileForm((p) => ({ ...p, location: loc }))
                  }
                  height="240px"
                  label="My Location *"
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={saveProfile}
                disabled={saving}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {saving ? "Saving…" : "Save Profile"}
              </button>
            </div>
          )}
        </div>

        {/* Assignments — unchanged */}
        <div>
          <h2 className="section-title">My Assignments ({assignments.length})</h2>
          {assignments.length === 0 ? (
            <div className="card">
              <div className="empty-state" style={{ padding: "30px 0" }}>
                <div className="empty-icon">✦</div>
                <p className="empty-text">No assignments yet</p>
                <p className="empty-sub">
                  Make sure your profile is complete and you're set as available
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {assignments.map((a) => (
                <div key={a._id} className={`issue-card ${a.issueId?.urgency || ""}`}>
                  <div className="issue-card-header">
                    <span className="issue-title">{a.issueId?.title || "Unknown Issue"}</span>
                    <span className={`badge badge-${a.status}`}>{a.status}</span>
                  </div>
                  <p className="text-sm text-muted mb-8">
                    {a.issueId?.description?.slice(0, 100)}…
                  </p>
                  <div className="issue-meta">
                    {a.issueId?.urgency && (
                      <span className={`badge badge-${a.issueId.urgency}`}>
                        {a.issueId.urgency}
                      </span>
                    )}
                    {a.issueId?.type && (
                      <span className={`badge badge-${a.issueId.type}`}>
                        {a.issueId.type}
                      </span>
                    )}
                  </div>

                  {a.verifiedByAdmin && (
                    <div className="text-xs" style={{ color: "var(--green)", marginTop: 10 }}>
                      ✓ Verified by admin — {a.creditsAwarded} credits earned!
                    </div>
                  )}

                  {!a.markedCompleteByVolunteer && a.status !== "verified" && (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: 12 }}
                      onClick={() => handleMarkComplete(a._id)}
                    >
                      Mark as Completed
                    </button>
                  )}

                  {a.markedCompleteByVolunteer && !a.verifiedByAdmin && (
                    <div
                      className="text-xs text-muted"
                      style={{ marginTop: 10, fontFamily: "var(--font-mono)" }}
                    >
                      ⏳ Awaiting admin verification…
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}