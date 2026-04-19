import React, { useState, useEffect } from "react";
import { donationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AMOUNTS = [100, 500, 1000, 5000];

export default function DonationPage() {
  const { user } = useAuth();
  const [amount, setAmount]     = useState("");
  const [custom, setCustom]     = useState(false);
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(null);
  const [history, setHistory]   = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    donationsAPI.getMine()
      .then(({ data }) => setHistory(data))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [success]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 1) {
      toast.error("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const { data } = await donationsAPI.create({
        amount: parseFloat(amount),
        donorName: user?.name,
        message,
      });
      setSuccess(data.donation);
      toast.success("Donation successful! 🙏");
      setAmount("");
      setMessage("");
      setCustom(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Donate</h1>
      <p className="page-subtitle">Your contribution directly funds relief operations</p>

      <div className="grid-2" style={{ gap: 32, alignItems: "start" }}>
        {/* Donation Form */}
        <div>
          {success ? (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
              <h2 className="section-title" style={{ color: "var(--green)", marginBottom: 8 }}>
                Thank You!
              </h2>
              <p className="text-muted mb-16">
                ₹{success.amount} donated successfully
              </p>
              <div style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "12px 16px",
                marginBottom: 24,
              }}>
                <div className="form-label" style={{ marginBottom: 4 }}>Payment ID</div>
                <span className="text-mono" style={{ fontSize: 11 }}>{success.paymentId}</span>
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setSuccess(null)}
              >
                Donate Again
              </button>
            </div>
          ) : (
            <div className="card">
              <h3 className="section-title">Make a Contribution</h3>

              {/* Quick amounts */}
              <div className="form-label" style={{ marginBottom: 8 }}>Select Amount</div>
              <div className="grid-4 mb-16" style={{ gap: 8 }}>
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setAmount(String(a)); setCustom(false); }}
                    className="btn"
                    style={{
                      justifyContent: "center",
                      background: String(amount) === String(a) && !custom
                        ? "var(--accent)" : "var(--bg3)",
                      color: String(amount) === String(a) && !custom
                        ? "#0a0a0a" : "var(--text2)",
                      border: "1px solid var(--border2)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                    }}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Custom Amount
                  <button
                    type="button"
                    onClick={() => { setCustom(true); setAmount(""); }}
                    style={{ marginLeft: 8, color: "var(--accent)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                  >
                    Enter Custom
                  </button>
                </label>
                {custom && (
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    placeholder="Enter amount in ₹"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    autoFocus
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Message (optional)</label>
                <input
                  className="form-input"
                  placeholder="A message of support…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>

              {/* PhonePe QR placeholder */}
              <div style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: 16,
                textAlign: "center",
                marginBottom: 16,
              }}>
                <div className="form-label" style={{ marginBottom: 8 }}>
                  Scan to Pay via PhonePe / UPI
                </div>
                {/* QR placeholder box */}
                <div style={{
                  width: 140, height: 140,
                  margin: "0 auto 8px",
                  background: "white",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#333", fontSize: 11, fontFamily: "var(--font-mono)",
                  border: "2px solid var(--border2)",
                }}>
                  QR CODE<br/>PLACEHOLDER
                </div>
                <p className="text-xs text-muted">
                  UPI ID: sahay@upi (replace with real UPI ID)
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleDonate}
                disabled={loading || !amount}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {loading ? "Processing…" : `Donate ₹${amount || "—"}`}
              </button>

              <p className="text-xs text-muted" style={{ marginTop: 12, textAlign: "center" }}>
                This is a simulated payment for demo purposes.
              </p>
            </div>
          )}
        </div>

        {/* Donation History */}
        <div>
          <h2 className="section-title">Your Donation History</h2>
          <div className="card">
            {loadingHistory ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 60 }} />)}
              </div>
            ) : history.length === 0 ? (
              <div className="empty-state" style={{ padding: "24px 0" }}>
                <div className="empty-icon" style={{ fontSize: 28 }}>◆</div>
                <p className="empty-text">No donations yet</p>
                <p className="empty-sub">Your contributions will appear here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {history.map((d, i) => (
                  <div key={d._id} style={{
                    padding: "14px 0",
                    borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>₹{d.amount}</div>
                      <div className="text-xs text-muted">
                        {new Date(d.createdAt).toLocaleDateString("en-IN")}
                        {d.message && ` · "${d.message}"`}
                      </div>
                    </div>
                    <span className="badge badge-completed">{d.status}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Total donated</span>
                    <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18, color: "var(--accent)" }}>
                      ₹{history.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}