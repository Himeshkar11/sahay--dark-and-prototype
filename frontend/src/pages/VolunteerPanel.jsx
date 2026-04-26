import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { assignmentsAPI, usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LocationPicker from "../components/LocationPicker";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SKILL_COLOR = { food: "#f0a050", medical: "#e87070", education: "#4ecf82" };
const TYPE_ICON = { food: "🍱", medical: "🏥", education: "📚" };
const URGENCY_COLOR = { high: "#e87070", medium: "#f0a050", low: "#4ecf82" };

function Avatar({ name, size = 72 }) {
  const initials = (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--accent) 0%, #7c6cff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.36, color: "#fff", flexShrink: 0,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    }}>
      {initials}
    </div>
  );
}

export default function VolunteerPanel() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ skills: [], availability: false, location: null });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [aRes, pRes] = await Promise.all([assignmentsAPI.getMine(), usersAPI.getProfile()]);
      setAssignments(aRes.data);
      setProfile(pRes.data);
      const { lat, lng } = pRes.data.location || {};
      setProfileForm({
        skills: pRes.data.skills || [],
        availability: pRes.data.availability || false,
        location: lat && lng ? { lat, lng } : null,
      });
    } catch {
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
    setProfileForm(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill],
    }));
  };

  const handleCancelEdit = () => {
    const { lat, lng } = profile?.location || {};
    setProfileForm({
      skills: profile?.skills || [],
      availability: profile?.availability || false,
      location: lat && lng ? { lat, lng } : null,
    });
    setEditing(false);
  };

  const saveProfile = async () => {
    if (!profileForm.location) { toast.error("Please select a location"); return; }
    setSaving(true);
    try {
      await usersAPI.updateProfile({
        skills: profileForm.skills,
        availability: profileForm.availability,
        location: { lat: profileForm.location.lat, lng: profileForm.location.lng },
      });
      toast.success("Profile updated!");
      setEditing(false);
      load();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 36, width: 220, marginBottom: 32 }} />
      <div className="grid-2" style={{ gap: 24 }}>
        <div className="skeleton" style={{ height: 240, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 240, borderRadius: 16 }} />
      </div>
    </div>
  );

  const viewLat = profile?.location?.lat;
  const viewLng = profile?.location?.lng;
  const hasLocation = Boolean(viewLat && viewLng);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: "4px 0 0" }}>
          Manage your volunteer profile and assignments
        </p>
      </div>

      <div className="grid-2" style={{ gap: 20, alignItems: "start" }}>
        {/* ── Profile card ── */}
        <div style={{
          background: "var(--bg2)", borderRadius: 20,
          border: "1px solid var(--border)", overflow: "hidden",
        }}>
          {/* Cover strip */}
          <div style={{
            height: 72,
            background: "linear-gradient(135deg, var(--accent) 0%, #6c5ce7 50%, #4ecf82 100%)",
          }} />

          <div style={{ padding: "0 20px 20px" }}>
            {/* Avatar overlapping cover */}
            <div style={{ marginTop: -36, marginBottom: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <Avatar name={user?.name || profile?.name} size={72} />
              <button
                className="btn btn-ghost btn-sm"
                onClick={editing ? handleCancelEdit : () => setEditing(true)}
                style={{ borderRadius: 20, marginBottom: 4 }}
              >
                {editing ? "Cancel" : "✏️ Edit"}
              </button>
            </div>

            {/* Name + credits */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>
                {user?.name || profile?.name || "Volunteer"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 6 }}>
                {profile?.email}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5,
                background: "rgba(var(--accent-rgb,100,100,255),0.1)",
                padding: "3px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                color: "var(--accent)", border: "1px solid rgba(var(--accent-rgb,100,100,255),0.2)",
              }}>
                ◆ {profile?.credits || 0} credits
              </div>
            </div>

            {!editing ? (
              /* VIEW MODE */
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Availability */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                    Status
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                    background: profile?.availability ? "rgba(78,207,130,0.12)" : "var(--bg3)",
                    color: profile?.availability ? "#4ecf82" : "var(--text3)",
                    border: profile?.availability ? "1px solid rgba(78,207,130,0.3)" : "1px solid var(--border2)",
                  }}>
                    {profile?.availability ? "🟢 Available" : "⚫ Not Available"}
                  </span>
                </div>

                {/* Skills */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                    Skills
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {profile?.skills?.length ? profile.skills.map(s => (
                      <span key={s} style={{
                        fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                        background: `${SKILL_COLOR[s] || "var(--accent)"}22`,
                        color: SKILL_COLOR[s] || "var(--accent)",
                        border: `1px solid ${SKILL_COLOR[s] || "var(--accent)"}44`,
                      }}>
                        {TYPE_ICON[s]} {s}
                      </span>
                    )) : (
                      <span style={{ fontSize: 13, color: "var(--text3)" }}>No skills set</span>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Location
                  </div>
                  {hasLocation ? (
                    <div>
                      <div style={{
                        height: 160, borderRadius: 12, overflow: "hidden",
                        border: "1px solid var(--border)", marginBottom: 8,
                      }}>
                        <MapContainer center={[viewLat, viewLng]} zoom={14}
                          style={{ height: "100%", width: "100%" }}
                          scrollWheelZoom={false} dragging={false}
                          zoomControl={false} attributionControl={false}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[viewLat, viewLng]} />
                        </MapContainer>
                      </div>
                      <div style={{
                        fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono, monospace)",
                        padding: "5px 10px", background: "var(--bg3)", borderRadius: 8,
                        border: "1px solid var(--border2)",
                      }}>
                        {viewLat.toFixed(5)}, {viewLng.toFixed(5)}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--text3)" }}>No location set</span>
                  )}
                </div>
              </div>
            ) : (
              /* EDIT MODE */
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Skills</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                    {["food", "medical", "education"].map(skill => (
                      <button key={skill} type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
                          border: profileForm.skills.includes(skill)
                            ? `1px solid ${SKILL_COLOR[skill]}88`
                            : "1px solid var(--border2)",
                          background: profileForm.skills.includes(skill)
                            ? `${SKILL_COLOR[skill]}22` : "var(--bg3)",
                          color: profileForm.skills.includes(skill)
                            ? SKILL_COLOR[skill] : "var(--text3)",
                          cursor: "pointer",
                        }}>
                        {TYPE_ICON[skill]} {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Availability</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <input type="checkbox" id="avail" checked={profileForm.availability}
                      onChange={e => setProfileForm(p => ({ ...p, availability: e.target.checked }))}
                      style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
                    <label htmlFor="avail" style={{ fontSize: 13 }}>
                      {profileForm.availability ? "🟢 Available" : "Set as available"}
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <LocationPicker
                    location={profileForm.location}
                    setLocation={loc => setProfileForm(p => ({ ...p, location: loc }))}
                    height="220px"
                    label="My Location *"
                  />
                </div>

                <button className="btn btn-primary" onClick={saveProfile} disabled={saving}
                  style={{ width: "100%", justifyContent: "center", borderRadius: 20 }}>
                  {saving ? "Saving…" : "Save Profile"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Assignments ── */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
            My Assignments
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
              background: "var(--bg3)", color: "var(--text3)", border: "1px solid var(--border2)",
            }}>
              {assignments.length}
            </span>
          </div>

          {assignments.length === 0 ? (
            <div style={{
              background: "var(--bg2)", borderRadius: 16, padding: "40px 20px",
              border: "1px solid var(--border)", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✦</div>
              <p style={{ fontWeight: 700, margin: 0 }}>No assignments yet</p>
              <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>
                Make sure your profile is complete and you're set as available
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {assignments.map(a => {
                const urgencyColor = URGENCY_COLOR[a.issueId?.urgency] || "var(--border2)";
                return (
                  <div key={a._id} style={{
                    background: "var(--bg2)", borderRadius: 16, overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}>
                    <div style={{ height: 3, background: urgencyColor }} />
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>
                          {a.issueId?.title || "Unknown Issue"}
                        </div>
                        <span className={`badge badge-${a.status}`} style={{ flexShrink: 0 }}>
                          {a.status}
                        </span>
                      </div>

                      <p style={{ fontSize: 13, color: "var(--text2)", margin: "0 0 10px", lineHeight: 1.5 }}>
                        {a.issueId?.description?.slice(0, 100)}…
                      </p>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {a.issueId?.urgency && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                            background: `${urgencyColor}22`, color: urgencyColor,
                          }}>{a.issueId.urgency}</span>
                        )}
                        {a.issueId?.type && (
                          <span style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 20,
                            background: "var(--bg3)", color: "var(--text2)", border: "1px solid var(--border2)",
                          }}>
                            {TYPE_ICON[a.issueId.type]} {a.issueId.type}
                          </span>
                        )}
                      </div>

                      {a.verifiedByAdmin && (
                        <div style={{ fontSize: 12, color: "#4ecf82", marginTop: 10 }}>
                          ✓ Verified — {a.creditsAwarded} credits earned!
                        </div>
                      )}

                      {!a.markedCompleteByVolunteer && a.status !== "verified" && (
                        <button className="btn btn-primary btn-sm"
                          style={{ marginTop: 12, borderRadius: 20 }}
                          onClick={() => handleMarkComplete(a._id)}>
                          Mark as Completed
                        </button>
                      )}

                      {a.markedCompleteByVolunteer && !a.verifiedByAdmin && (
                        <div style={{
                          fontSize: 12, color: "var(--text3)", marginTop: 10,
                          fontFamily: "var(--font-mono)",
                        }}>
                          ⏳ Awaiting admin verification…
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}