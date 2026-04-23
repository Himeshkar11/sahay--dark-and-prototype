import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { issuesAPI, donationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./dashboard.css";

/* ── Tiny relative-time helper (no dayjs needed) ───────────── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 60)  return mins  <= 1 ? "just now"       : `${mins}m ago`;
  if (hours < 24)  return hours === 1 ? "1 hour ago"    : `${hours}h ago`;
  if (days  === 1) return "yesterday";
  if (days  < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN");
}

/* ── Priority config ────────────────────────────────────────── */
const PRIORITY = {
  high:   { dot: "🔴", label: "High",   class: "badge-high"   },
  medium: { dot: "🟡", label: "Medium", class: "badge-medium" },
  low:    { dot: "🟢", label: "Low",    class: "badge-low"    },
};

/* ── Stat card data (icon + colour class) ───────────────────── */
const STAT_CONFIG = [
  { key: "total",     label: "Total Issues",  icon: "⊞",  colorClass: "default" },
  { key: "open",      label: "Open",          icon: "◎",  colorClass: "blue",   valueClass: "blue"   },
  { key: "assigned",  label: "In Progress",   icon: "⟳",  colorClass: "accent", valueClass: "accent" },
  { key: "completed", label: "Resolved",      icon: "✓",  colorClass: "green",  valueClass: "green"  },
];

/* ════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const [issues,    setIssues]    = useState([]);
  const [stats,     setStats]     = useState({ open:0, assigned:0, completed:0, total:0 });
  const [donations, setDonations] = useState({ total:0, count:0 });
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: issueData } = await issuesAPI.getAll();
        setIssues(issueData.slice(0, 5));
        setStats({
          total:     issueData.length,
          open:      issueData.filter(i => i.status === "open").length,
          assigned:  issueData.filter(i => i.status === "assigned").length,
          completed: issueData.filter(i => i.status === "completed").length,
        });
        if (user.role === "admin") {
          const { data: donData } = await donationsAPI.getAll();
          setDonations({ total: donData.total, count: donData.count });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  /* ── Skeleton ─────────────────────────────────────────────── */
  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 36, width: 240, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: 180, marginBottom: 36 }} />
      <div className="grid-4 mb-32">
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton" style={{ height: 106, borderRadius: "var(--radius-lg)" }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 18, width: 140, marginBottom: 16 }} />
      {[1,2,3].map(i => (
        <div key={i} className="skeleton" style={{ height: 84, borderRadius: "var(--radius-lg)", marginBottom: 10 }} />
      ))}
    </div>
  );

  const firstName = user.name.split(" ")[0];
  const initials  = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div>
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-32 animate-in">
        <div>
          <h1 className="page-title">
            Good to see you,{" "}
            <span className="greeting-accent">{firstName}</span>
          </h1>
          <p className="page-subtitle">Here's what's happening across your platform</p>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          {user.role === "admin" ? (
            <Link to="/issues" className="btn btn-primary">
              <span style={{ fontSize:18, lineHeight:1 }}>+</span> Add Issue
            </Link>
          ) : (
            <>
              <Link to="/volunteer" className="btn btn-ghost btn-sm">My Assignments</Link>
              <Link to="/donate"    className="btn btn-primary btn-sm">◆ Contribute</Link>
            </>
          )}
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="grid-4 mb-32">
        {STAT_CONFIG.map((cfg, idx) => (
          <div
            key={cfg.key}
            className={`stat-card animate-in delay-${idx + 1}`}
          >
            <div className={`stat-icon ${cfg.colorClass}`}>{cfg.icon}</div>
            <div>
              <span className="stat-label">{cfg.label}</span>
              <div className={`stat-value ${cfg.valueClass || ""}`}>
                {stats[cfg.key]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Admin donation stats ───────────────────────────── */}
      {user.role === "admin" && (
        <div className="grid-2 mb-32 animate-in delay-5">
          <div className="stat-card">
            <div className="stat-icon orange">₹</div>
            <div>
              <span className="stat-label">Total Donations</span>
              <div className="stat-value orange">
                ₹{donations.total.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon accent">♡</div>
            <div>
              <span className="stat-label">Total Donors</span>
              <div className="stat-value">{donations.count}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Issues header ───────────────────────────── */}
      <div className="flex items-center justify-between mb-16 animate-in delay-5">
        <p className="section-title" style={{ marginBottom:0 }}>Recent Issues</p>
        <Link to="/issues" className="btn btn-ghost btn-sm">View all →</Link>
      </div>

      {/* ── Issue list ────────────────────────────────────── */}
      {issues.length === 0 ? (
        <div className="card animate-in delay-5">
          <div className="empty-state">
            <div className="empty-icon">⊞</div>
            <p className="empty-text">No issues yet</p>
            <p className="empty-sub">
              Issues will show up here once they're reported or created
            </p>
            {user.role === "admin" && (
              <Link to="/issues" className="btn btn-primary btn-sm" style={{ marginTop:14 }}>
                + Create first issue
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {issues.map((issue, idx) => {
            const prio = PRIORITY[issue.urgency] ?? PRIORITY.low;
            return (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className={`issue-card ${issue.urgency} animate-in`}
                style={{ animationDelay: `${(idx + 1) * 0.06}s` }}
              >
                <div className="issue-card-header">
                  <span className="issue-title">{issue.title}</span>
                  <span className={`badge badge-${issue.status}`}>
                    {issue.status}
                  </span>
                </div>

                <p
                  className="text-sm text-muted"
                  style={{
                    marginBottom: 0,
                    display:"-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {issue.description}
                </p>

                <div className="issue-meta">
                  <span className={`badge ${prio.class}`}>
                    {prio.dot} {prio.label}
                  </span>
                  <span className={`badge badge-${issue.type}`}>{issue.type}</span>
                  <span
                    className="text-xs text-muted"
                    style={{ marginLeft:"auto" }}
                    title={new Date(issue.createdAt).toLocaleString("en-IN")}
                  >
                    {timeAgo(issue.createdAt)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}