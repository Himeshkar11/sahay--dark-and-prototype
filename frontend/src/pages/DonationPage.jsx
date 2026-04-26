import React, { useState, useEffect } from "react";
import { donationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./DonationPage.css";

// ─────────────────────────────────────────────────────────────
// 👇 SWAP THIS with your actual QR image path or import
//    e.g. import qrImage from "../assets/upi-qr.png"
//    or:  const QR_IMAGE_SRC = "/assets/upi-qr.png";
// ─────────────────────────────────────────────────────────────
const QR_IMAGE_SRC = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=sahay@upi";// ← replace with your real QR code image path
const UPI_ID = "sahay@upi"; // ← replace with your real UPI ID

const AMOUNTS = [100, 500, 1000, 5000];

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  if (days  === 1) return "yesterday";
  if (days  >  1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`; 
  return "just now";
}

/* ── Copy UPI ID with feedback ───────────────────────────── */
function CopyUpiButton({ upiId }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      className={`don-copy-btn ${copied ? "copied" : ""}`}
      onClick={handleCopy}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function DonationPage() {
  const { user } = useAuth();
  const [amount,         setAmount]         = useState("");
  const [custom,         setCustom]         = useState(false);
  const [message,        setMessage]        = useState("");
  const [loading,        setLoading]        = useState(false);
  const [success,        setSuccess]        = useState(null);
  const [history,        setHistory]        = useState([]);
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
        amount:    parseFloat(amount),
        donorName: user?.name,
        message,
      });
      setSuccess(data.donation);
      toast.success("Donation successful — thank you! 🙏");
      setAmount("");
      setMessage("");
      setCustom(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  const selectAmount = (a) => { setAmount(String(a)); setCustom(false); };

  return (
    <div className="don-page">
      {/* ── Page header ────────────────────────────────────── */}
      <div className="don-page-header don-animate">
        <h1 className="don-page-title">
          Support the <span>Relief Fund</span>
        </h1>
        <p className="don-page-sub">
          Your contribution directly funds on-ground relief operations and
          helps resolve critical civic issues faster.
        </p>
        <div className="don-trust-strip">
          <span className="don-trust-item">
            <span className="don-trust-dot" />
            Secure payments
          </span>
          <span className="don-trust-item">
            <span className="don-trust-dot" />
            100% goes to relief
          </span>
          <span className="don-trust-item">
            <span className="don-trust-dot" />
            Instant confirmation
          </span>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div className="don-layout">

        {/* ── LEFT: Form card ──────────────────────────────── */}
        <div className="don-d1 don-animate">
          {success ? (
            /* ── Success state ─────────────────────────────── */
            <div className="don-card">
              <div className="don-success-state">
                <div className="don-success-icon">🙏</div>
                <div className="don-success-title">Thank you!</div>
                <div className="don-success-amount">
                  ₹{success.amount.toLocaleString("en-IN")}
                </div>
                <p style={{ fontSize:13, color:"var(--don-text2)", margin:0 }}>
                  donated successfully
                </p>
                <div className="don-payment-id-box" style={{ marginTop:8 }}>
                  <div className="don-payment-id-label">Payment Reference</div>
                  <div className="don-payment-id-val">{success.paymentId}</div>
                </div>
                <button
                  className="don-btn-ghost"
                  style={{ marginTop:8 }}
                  onClick={() => setSuccess(null)}
                >
                  ← Donate again
                </button>
              </div>
            </div>
          ) : (
            /* ── Donation form ─────────────────────────────── */
            <div className="don-card">
              <div className="don-card-body">
                <div className="don-card-title">Make a Contribution</div>
                <div className="don-card-desc">
                  Choose an amount and scan the QR code with any UPI app — PhonePe,
                  GPay, Paytm, or your bank app.
                </div>

                {/* Amount picker */}
                <div className="don-form-group">
                  <span className="don-label">Select Amount</span>
                  <div className="don-amounts">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className={`don-amt-btn ${String(amount) === String(a) && !custom ? "selected" : ""}`}
                        onClick={() => selectAmount(a)}
                      >
                        ₹{a.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div className="don-form-group">
                  <span className="don-label">
                    Custom
                    <button
                      type="button"
                      className="don-custom-toggle"
                      onClick={() => { setCustom(true); setAmount(""); }}
                    >
                      Enter custom amount
                    </button>
                  </span>
                  {custom && (
                    <input
                      className="don-input"
                      type="number"
                      min="1"
                      placeholder="₹ Enter amount"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>

                {/* Message */}
                <div className="don-form-group">
                  <span className="don-label">Message (optional)</span>
                  <input
                    className="don-input"
                    placeholder="A word of support…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                {/* QR Section */}
                <div className="don-qr-section">
                  <div className="don-qr-label">Scan &amp; Pay via UPI</div>

                  <div className="don-qr-wrapper">
                    {QR_IMAGE_SRC ? (
                      <img
                        src={QR_IMAGE_SRC}
                        alt="UPI QR code for donation"
                        className="don-qr-img"
                      />
                    ) : (
                      /* Placeholder — remove once QR_IMAGE_SRC is set */
                      <div className="don-qr-placeholder">
                        <span style={{ fontSize:32 }}>▦</span>
                        <span>Your QR here</span>
                        <span style={{ fontSize:9 }}>set QR_IMAGE_SRC</span>
                      </div>
                    )}
                  </div>

                  <p className="don-qr-hint">
                    Open PhonePe, GPay, or any UPI app → Scan QR
                  </p>

                  <div className="don-upi-row">
                    <span className="don-upi-id">{UPI_ID}</span>
                    <CopyUpiButton upiId={UPI_ID} />
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="don-btn-primary"
                  onClick={handleDonate}
                  disabled={loading || !amount}
                >
                  {loading ? (
                    <>
                      Processing
                      <span className="don-loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                      </span>
                    </>
                  ) : (
                    <>
                      ◆ Confirm Donation
                      {amount ? ` · ₹${parseFloat(amount).toLocaleString("en-IN")}` : ""}
                    </>
                  )}
                </button>

                <p className="don-disclaimer">
                  Simulated payment for demo purposes. No real transaction occurs.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: History card ───────────────────────────── */}
        <div className="don-d2 don-animate">
          <div className="don-card">
            <div className="don-history-header">Your Donations</div>
            <div className="don-history-body">
              {loadingHistory ? (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[1,2,3].map(i => (
                    <div key={i} className="don-skeleton" style={{ height:52 }} />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="don-empty">
                  <div className="don-empty-icon">◆</div>
                  <div className="don-empty-text">No donations yet</div>
                  <div className="don-empty-sub">
                    Your contributions will appear here
                  </div>
                </div>
              ) : (
                <>
                  {history.map((d) => (
                    <div key={d._id} className="don-history-row">
                      <div>
                        <div className="don-history-amount">
                          ₹{d.amount.toLocaleString("en-IN")}
                        </div>
                        <div className="don-history-meta">
                          {timeAgo(d.createdAt)}
                          {d.message && ` · "${d.message}"`}
                        </div>
                      </div>
                      <span className="don-badge-done">✓ {d.status}</span>
                    </div>
                  ))}

                  <div className="don-history-total">
                    <span className="don-total-label">Total contributed</span>
                    <span className="don-total-value">
                      ₹{history.reduce((s, d) => s + d.amount, 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}