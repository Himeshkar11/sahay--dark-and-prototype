import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Utility: useInView hook ────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const Icon = {
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  Road: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M5 21L9 3m6 0l4 18M9 3h6M5 21h14"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="12" y1="13" x2="12" y2="13.01"/>
    </svg>
  ),
  Droplet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Flag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Map: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Github: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ─── Animated Section Wrapper ─────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Spline 3D Scene ──────────────────────────────────────────────────────────
function SplineScene() {
  const [loaded, setLoaded] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.05 });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
        borderRadius: 24,
        overflow: "hidden",
        opacity: loaded ? 1 : 0.6,
        transform: loaded ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
        transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
        boxShadow: "0 0 0 1px rgba(0,210,211,0.12), 0 32px 80px rgba(0,210,211,0.07), 0 0 120px rgba(95,39,205,0.09)",
      }}
    >
      {/* Spinner while loading */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "linear-gradient(135deg, rgba(0,210,211,0.03) 0%, rgba(95,39,205,0.05) 100%)",
          borderRadius: 24,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "2px solid rgba(0,210,211,0.15)",
            borderTopColor: "#00d2d3",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(0,210,211,0.5)", letterSpacing: "0.5px" }}>Loading 3D scene…</span>
        </div>
      )}

      {/* Lazy render — only mount iframe when section enters viewport */}
      {inView && (
<iframe
  src="https://my.spline.design/boxeshover-5FmE8BJQR6OLwv6w4RzKEjaz/"
  frameBorder="0"
  width="100%"
  height="100%"
  style={{
    border: "none",
    width: "100%",
    height: "100%",
    display: "block",
  }}
  allow="autoplay; fullscreen"
  title="Spline 3D"
/>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Features", "How It Works", "Impact", "Roadmap"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(6,12,26,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,210,211,0.12)" : "none",
      transition: "all 0.3s ease",
      padding: "0 5vw",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #00d2d3, #5f27cd)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif",
          }}>C</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.3px" }}>
            Comm<span style={{ color: "#00d2d3" }}>unity</span>Conn<span style={{ color: "#00d2d3" }}>8</span>
          </span>
        </a>

        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {links.map(l => (
            <a key={l} href={`#${l.replace(/\s/g, "").toLowerCase()}`}
              style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#00d2d3"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
            >{l}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "8px 20px", borderRadius: 8,
            border: "1px solid rgba(0,210,211,0.4)",
            color: "#00d2d3", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 14, background: "transparent", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(0,210,211,0.1)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}
          >Log In</button>

          <button onClick={() => navigate("/signup")} style={{
            padding: "8px 20px", borderRadius: 8,
            background: "linear-gradient(135deg, #00d2d3, #5f27cd)",
            color: "#fff", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
          }}>Get Started</button>

          <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }} className="mobile-menu-btn">
            {open ? <Icon.X /> : <Icon.Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{
          background: "rgba(6,12,26,0.97)", padding: "20px 5vw 28px",
          borderTop: "1px solid rgba(0,210,211,0.12)",
          display: "flex", flexDirection: "column", gap: 18,
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.replace(/\s/g, "").toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 16, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}
            >{l}</a>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&family=Space+Mono&display=swap');
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "100px 5vw 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Spline 3D Background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://my.spline.design/boxeshover-5FmE8BJQR6OLwv6w4RzKEjaz/"
          frameBorder="0"
          title="Spline 3D Background"
          allow="autoplay; fullscreen"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>

      {/* ── Dark Overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "rgba(6,12,26,0.68)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 100,
            border: "1px solid rgba(0,210,211,0.3)",
            background: "rgba(0,210,211,0.06)",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00d2d3",
            }}
          />
          <span style={{ color: "#00d2d3", fontSize: 13 }}>
            SAHAY — Community Platform
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 1.1,
            color: "#fff",
            marginBottom: 22,
          }}
        >
          Connecting Communities.
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #00d2d3, #a29bfe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Solving Real Problems.
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.7)",
            maxWidth: 600,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          CommunityConn8 empowers NGOs and volunteers to tackle local issues
          with coordination, clarity, and real-world impact.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* ✅ FIXED */}
          <a
            href="/signup"
            style={{
              padding: "14px 28px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #00d2d3, #5f27cd)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Get Started
          </a>

          {/* ✅ FIXED */}
          <a
            href="#features"
            style={{
              padding: "14px 28px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              textDecoration: "none",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            Explore Platform
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────
function Problem() {
  const issues = [
    { icon: <Icon.Trash />, color: "#ff6b6b", bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.2)", title: "Overflowing Waste", desc: "Garbage piles up for weeks with no admin looped in to assign help. Communities suffer while the issue sits in a void." },
    { icon: <Icon.Road />, color: "#ffa502", bg: "rgba(255,165,2,0.08)", border: "rgba(255,165,2,0.2)", title: "Damaged Roads", desc: "Potholes and broken infrastructure persist for months. Without proper assignment tools, volunteers can't mobilize fast enough." },
    { icon: <Icon.Droplet />, color: "#74b9ff", bg: "rgba(116,185,255,0.08)", border: "rgba(116,185,255,0.2)", title: "Water Shortages", desc: "Supply failures hit communities daily. NGOs lack the coordination layer to deploy volunteer help before it's too late." },
  ];
  return (
    <section id="problem" style={{ background: "#060c1a", padding: "100px 5vw", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#ff6b6b", letterSpacing: "3px", textTransform: "uppercase" }}>The Problem</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", textAlign: "center", marginBottom: 16, letterSpacing: "-0.5px" }}>
            Why Are Local Issues Still Unresolved?
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 560, margin: "0 auto 60px" }}>
            Volunteers are willing. NGOs have capacity. But without visibility and coordination, nothing gets done.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {issues.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.12}>
              <div style={{
                background: item.bg, border: `1px solid ${item.border}`,
                borderRadius: 16, padding: "32px 28px",
                transition: "transform 0.25s, box-shadow 0.25s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${item.bg}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ color: item.color, marginBottom: 18 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div style={{
            marginTop: 48, padding: "24px 32px",
            background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)",
            borderRadius: 12, textAlign: "center",
          }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
              "The gap isn't resources or willpower — it's <strong style={{ color: "#fff" }}>coordination and visibility</strong>. That's exactly what CommunityConn8 solves."
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Solution Section — Admin → Volunteer ─────────────────────────────────────
function Solution() {
  const steps = [
    { role: "Admin / NGO", emoji: "🏢", color: "#a29bfe", desc: "Identifies and logs community issues on the platform. Reviews all incoming reports, validates them, and assigns tasks to the right volunteers with full dashboard control." },
    { role: "Volunteer", emoji: "🦺", color: "#55efc4", desc: "Receives an assigned task with full context and location. Heads to the site, resolves the issue on the ground, and marks it complete — keeping the admin updated in real time." },
  ];
  return (
    <section id="solution" style={{ background: "#080f20", padding: "100px 5vw", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00d2d3", letterSpacing: "3px", textTransform: "uppercase" }}>The Solution</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", textAlign: "center", marginBottom: 16, letterSpacing: "-0.5px" }}>
            A Connected Flow That Actually Works
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 560, margin: "0 auto 70px" }}>
            Two roles. One coordinated platform. Every issue gets logged, assigned, and resolved.
          </p>
        </FadeIn>

        {/* Centred two-card layout with arrow connector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.role} style={{ display: "flex", alignItems: "center", flex: "0 1 360px", minWidth: 240, maxWidth: 400 }}>
              <FadeIn delay={i * 0.18} style={{ flex: 1 }}>
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}30`,
                  borderRadius: 16, padding: "40px 32px", textAlign: "center",
                  transition: "all 0.25s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${s.color}0a`; e.currentTarget.style.borderColor = `${s.color}60`; e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = `${s.color}30`; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <div style={{ fontSize: 52, marginBottom: 20 }}>{s.emoji}</div>
                  <div style={{
                    display: "inline-block", padding: "4px 14px", borderRadius: 100,
                    background: `${s.color}15`, border: `1px solid ${s.color}40`,
                    color: s.color, fontFamily: "'Space Mono', monospace", fontSize: 12,
                    fontWeight: 700, marginBottom: 18, letterSpacing: "1px",
                  }}>{s.role.toUpperCase()}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </FadeIn>
              {i < steps.length - 1 && (
                <div style={{ padding: "0 24px", color: "#00d2d3", fontSize: 28, flexShrink: 0, opacity: 0.45 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: <Icon.Shield />, color: "#00d2d3", title: "Secure Authentication", desc: "Role-based access for Admins and Volunteers with JWT-secured sessions and fully protected routes." },
    { icon: <Icon.Flag />, color: "#ff9ff3", title: "Issue Management", desc: "Log, categorise, and track issues with location tags, priority levels, and live status updates." },
    { icon: <Icon.BarChart />, color: "#ffa502", title: "Admin Dashboard", desc: "Full situational awareness — view all active issues, filter by status, and dispatch volunteers instantly." },
    { icon: <Icon.Users />, color: "#a29bfe", title: "Volunteer Management", desc: "Onboard, assign, and track volunteers. Match the right person to the right task every time." },
    { icon: <Icon.Activity />, color: "#55efc4", title: "Real-Time Tracking", desc: "Live status updates on every issue — from logged to in-progress to resolved. Zero blind spots." },
    { icon: <Icon.Map />, color: "#74b9ff", title: "Location Intelligence", desc: "Geospatial issue mapping helps prioritise hotspots and deploy volunteers where they're needed most." },
  ];
  return (
    <section id="features" style={{ background: "#060c1a", padding: "100px 5vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#a29bfe", letterSpacing: "3px", textTransform: "uppercase" }}>Features</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", textAlign: "center", marginBottom: 16, letterSpacing: "-0.5px" }}>
            Everything a Community Needs
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 520, margin: "0 auto 64px" }}>
            Purpose-built tools for each role — seamlessly integrated into one cohesive experience.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "28px 24px", transition: "all 0.25s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${f.color}08`; e.currentTarget.style.borderColor = `${f.color}30`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${f.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works — 3 steps (Admin logs → Admin assigns → Volunteer resolves) ──
function HowItWorks() {
  const steps = [
    { num: "01", color: "#a29bfe", title: "Admin Logs the Issue", desc: "The NGO or admin identifies a community problem — broken road, overflow bin, dry tap — and creates a detailed issue on the platform with category, location, and priority level." },
    { num: "02", color: "#00d2d3", title: "Admin Assigns a Volunteer", desc: "The admin reviews available volunteers on the dashboard, selects the best fit for the task, and dispatches them with all necessary context and location details." },
    { num: "03", color: "#55efc4", title: "Volunteer Resolves It", desc: "The volunteer receives a notification with full issue details, heads to the site, fixes the problem on-ground, and marks it resolved. The admin is updated in real time." },
  ];
  return (
    <section id="howitworks" style={{ background: "#080f20", padding: "100px 5vw" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#55efc4", letterSpacing: "3px", textTransform: "uppercase" }}>Process</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", textAlign: "center", marginBottom: 64, letterSpacing: "-0.5px" }}>
            How It Works — In 3 Steps
          </h2>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 0.15}>
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 28,
                background: "rgba(255,255,255,0.025)", border: `1px solid ${s.color}20`,
                borderRadius: 16, padding: "28px 32px", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}50`; e.currentTarget.style.background = `${s.color}05`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${s.color}20`; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
              >
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 36, color: s.color, opacity: 0.4, lineHeight: 1, flexShrink: 0, minWidth: 56 }}>{s.num}</div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Impact Section ───────────────────────────────────────────────────────────
function Impact() {
  const points = [
    "Every resolved issue builds accountability between NGOs and local communities",
    "Volunteers gain recognition and real-world impact — not just volunteer hours",
    "NGOs demonstrate measurable outcomes to stakeholders and funders",
    "Cities become more responsive, coordinated, and liveable",
  ];
  return (
    <section id="impact" style={{ background: "#060c1a", padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,211,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="impact-grid">
          <FadeIn>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00d2d3", letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: 16 }}>Impact & Vision</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#fff", marginBottom: 20, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              Empowering Communities<br />with Technology
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 32 }}>
              Sahay isn't just software — it's infrastructure for civic action. When every volunteer is matched to the right task and every NGO has full visibility, communities transform.
            </p>
            <a href="#cta" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 28px", borderRadius: 8,
              background: "linear-gradient(135deg, #00d2d3, #5f27cd)",
              color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: 14, textDecoration: "none",
            }}>Join the Movement <Icon.Arrow /></a>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {points.map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  background: "rgba(255,255,255,0.025)", borderRadius: 12,
                  padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "rgba(0,210,211,0.15)", border: "1px solid rgba(0,210,211,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d2d3", marginTop: 1 }}><Icon.Check /></div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{p}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
      <style>{`@media(max-width:768px){ .impact-grid { grid-template-columns:1fr!important; gap:48px!important; } }`}</style>
    </section>
  );
}

// ─── Roadmap — Payment removed, balanced 3-card grid ─────────────────────────
function Roadmap() {
  const upcoming = [
    { icon: <Icon.Map />, color: "#0fbcf9", title: "Live Maps", desc: "Real-time geospatial view of all active issues across the city. Admins see problems the moment they're logged and deploy volunteers faster than ever." },
    { icon: <Icon.Bell />, color: "#ff5e57", title: "Smart Notifications", desc: "Push alerts for admins and instant SMS for volunteers — real-time updates at every stage of the issue resolution pipeline." },
    { icon: <Icon.Moon />, color: "#a29bfe", title: "Dark Mode", desc: "Full dark/light theme toggle with system preference detection across all admin and volunteer dashboards." },
  ];
  return (
    <section id="roadmap" style={{ background: "#080f20", padding: "100px 5vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#ffd32a", letterSpacing: "3px", textTransform: "uppercase" }}>Roadmap</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", textAlign: "center", marginBottom: 16, letterSpacing: "-0.5px" }}>
            What's Coming Next
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 520, margin: "0 auto 64px" }}>
            We're just getting started. Here's a preview of the features already in development.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="roadmap-grid">
          {upcoming.map((u, i) => (
            <FadeIn key={u.title} delay={i * 0.12}>
              <div style={{
                background: "rgba(255,255,255,0.025)", border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "32px 24px",
                transition: "all 0.25s", cursor: "default",
                position: "relative", height: "100%",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderStyle = "solid"; e.currentTarget.style.borderColor = `${u.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderStyle = "dashed"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  padding: "2px 10px", borderRadius: 100,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "1px",
                }}>SOON</div>
                <div style={{ color: u.color, marginBottom: 18 }}>{u.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 10 }}>{u.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{u.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <style>{`@media(max-width:768px){ .roadmap-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTA() {
  const navigate = useNavigate();
  return (
    <section id="cta" style={{ background: "#060c1a", padding: "100px 5vw" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,210,211,0.08) 0%, rgba(95,39,205,0.08) 100%)",
            border: "1px solid rgba(0,210,211,0.2)",
            borderRadius: 24, padding: "clamp(40px, 6vw, 72px)",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(95,39,205,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,211,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00d2d3", letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: 20, position: "relative" }}>Get Involved</span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#fff", marginBottom: 20, letterSpacing: "-0.5px", position: "relative" }}>
              Join the Movement
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7, position: "relative" }}>
              Whether you're an NGO ready to scale your impact or a volunteer eager to make a real difference — CommunityConn8 is your platform.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <button onClick={() => navigate("/signup")} style={{
                padding: "14px 36px", borderRadius: 10,
                background: "linear-gradient(135deg, #00d2d3, #5f27cd)",
                color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0,210,211,0.25)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,210,211,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,210,211,0.25)"; }}
              >Sign Up Free</button>
              <button onClick={() => navigate("/login")} style={{
                padding: "14px 36px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.85)", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: 15, background: "rgba(255,255,255,0.04)",
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              >Log In</button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Platform: ["Features", "How It Works", "Roadmap", "Impact"],
    Roles: ["For Volunteers", "For NGOs", "For Admins"],
    Project: ["GitHub", "About", "Contact", "Privacy Policy"],
  };
  return (
    <footer style={{ background: "#040a16", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 5vw 36px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: 40, marginBottom: 48 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00d2d3, #5f27cd)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, color: "#fff" }}>C</div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>CommunityConn8</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 240, marginBottom: 24 }}>
              Bridging the gap between problems and solutions — one community at a time.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { icon: <Icon.Github />, href: "https://github.com/himeshkar" },
                { icon: <Icon.Twitter />, href: "#" },
                { icon: <Icon.LinkedIn />, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,210,211,0.4)"; e.currentTarget.style.color = "#00d2d3"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.7)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>{group}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(item => (
                  <a key={item} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#00d2d3"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
                  >{item}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            © 2024 CommunityConn8 (Sahay). All rights reserved.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            Built by{" "}
            <a href="https://github.com/himeshkar" target="_blank" rel="noopener noreferrer" style={{ color: "#00d2d3", textDecoration: "none", fontWeight: 600 }}>Himeshkar</a>
            {" "}with ❤️ for communities
          </p>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function CommunityConn8Landing() {
  return (
    <div style={{ background: "#060c1a", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <Impact />
      <Roadmap />
      <CTA />
      <Footer />
    </div>
  );
}