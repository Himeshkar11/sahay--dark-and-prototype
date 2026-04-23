import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { issuesAPI, donationsAPI, assignmentsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const URGENCY_LABEL = { high: "🔴", medium: "🟡", low: "🟢" };

export default function DashboardPage() {
  const { user } = useAuth();
  const [issues, setIssues]     = useState([]);
  const [stats,  setStats]      = useState({ open: 0, assigned: 0, completed: 0, total: 0 });
  const [donations, setDonations] = useState({ total: 0, count: 0 });
  const [loading, setLoading]   = useState(true);

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

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 36, width: 220, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 18, width: 160, marginBottom: 32 }} />
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-32">
        <div>
          <h1 className="page-title">
            Good to see you,{" "}
            <span style={{ color: "var(--accent)" }}>{user.name.split(" ")[0]}</span>
          </h1>
          <p className="page-subtitle">Here's what's happening across the platform</p>
        </div>
        {user.role === "admin" && (
          <Link to="/issues" className="btn btn-primary">
            + Add Issue
          </Link>
        )}
        {user.role !== "admin" && (
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/volunteer" className="btn btn-ghost btn-sm">My Assignments</Link>
            <Link to="/donate" className="btn btn-primary btn-sm">Contribute ◆</Link>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid-4 mb-32">
        <div className="stat-card">
          <span className="stat-label">Total Issues</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Open</span>
          <span className="stat-value blue">{stats.open}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Assigned</span>
          <span className="stat-value accent">{stats.assigned}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value green">{stats.completed}</span>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="grid-2 mb-32">
          <div className="stat-card">
            <span className="stat-label">Total Donations</span>
            <span className="stat-value accent">₹{donations.total.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Donors</span>
            <span className="stat-value">{donations.count}</span>
          </div>
        </div>
      )}

      {/* Recent Issues */}
      <div className="flex items-center justify-between mb-16">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Issues</h2>
        <Link to="/issues" className="btn btn-ghost btn-sm">View all →</Link>
      </div>

      {issues.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">⊞</div>
            <p className="empty-text">No issues yet</p>
            <p className="empty-sub">Issues will appear here once they're created</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {issues.map((issue) => (
            <Link key={issue._id} to={`/issues/${issue._id}`} style={{ display: "block" }}>
              <div className={`issue-card ${issue.urgency}`}>
                <div className="issue-card-header">
                  <span className="issue-title">{issue.title}</span>
                  <span className={`badge badge-${issue.status}`}>{issue.status}</span>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: 0, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {issue.description}
                </p>
                <div className="issue-meta">
                  <span className={`badge badge-${issue.urgency}`}>
                    {URGENCY_LABEL[issue.urgency]} {issue.urgency}
                  </span>
                  <span className={`badge badge-${issue.type}`}>{issue.type}</span>
                  <span className="text-xs text-muted" style={{ marginLeft: "auto" }}>
                    {new Date(issue.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}