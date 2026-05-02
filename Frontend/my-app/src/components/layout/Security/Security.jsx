import React, { useEffect, useRef, useState } from 'react';
import './Security.css';

// ─── Reusable IntersectionObserver hook ───────────────────────────────────────
function useReveal(threshold = 0.2, delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return [ref, visible];
}

// ─── Security features data ────────────────────────────────────────────────────
const FEATURES = [
  {
    badge: 'E2E Encrypted',
    title: 'End-to-end encryption',
    desc: 'Every call and message is encrypted before it leaves your device. Only you and the people you invite can ever read or hear it.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    badge: 'Zero storage',
    title: 'We never record your calls',
    desc: 'Nothing is stored on our servers. No recordings, no transcripts, no message history. When the call ends, it\'s gone.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    ),
  },
  {
    badge: 'No account needed',
    title: 'Join without signing up',
    desc: 'Guests can join any call with just a link — no account, no app download, no personal data required to get started.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <line x1="18" y1="8" x2="23" y2="13" />
        <line x1="23" y1="8" x2="18" y2="13" />
      </svg>
    ),
  },
  {
    badge: 'Private by default',
    title: 'No data sold. Ever.',
    desc: 'We don\'t run ads, we don\'t sell your data, and we don\'t build profiles on you. Your conversations belong to you.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

// ─── Animated section card ─────────────────────────────────────────────────────
function SecCard({ feature, delay }) {
  const [ref, visible] = useReveal(0.2, delay);
  return (
    <div ref={ref} className={`sec-card ${visible ? 'visible' : ''}`}>
      <div className="sec-card-icon">{feature.icon}</div>
      <div className="sec-card-body">
        <div className="sec-card-title">{feature.title}</div>
        <div className="sec-card-desc">{feature.desc}</div>
      </div>
      <span className="sec-card-badge">{feature.badge}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export const Security = () => {
  const [visualRef, visualVisible] = useReveal(0.2);
  const [headerRef, headerVisible] = useReveal(0.2, 100);

  return (
    <section className="security-section">
      {/* Background */}
      <div className="sec-bg">
        <div className="sec-grid" />
      </div>

      <div className="sec-inner">
        {/* ── LEFT: Shield visual ── */}

        <div ref={visualRef} className={`sec-visual ${visualVisible ? 'visible' : ''}`}>
          
          {/* Animated shield */}
          <div className="shield-wrapper">
            <div className="pulse-ring" />
            <div className="pulse-ring" />
            <div className="pulse-ring" />
            <div className="shield-core">
              <div className="shield-scan" />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
          </div>

          {/* Live status */}
          <div className="sec-status">
            <span className="status-dot" />
            Connection secured &amp; encrypted
          </div>

          {/* Encryption flow diagram */}
          <div className="enc-path">
            <div className="enc-node">
              <div className="enc-node-circle">👤</div>
              <span className="enc-node-label">You</span>
            </div>

            <div className="enc-line" />

            <div className="enc-lock">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <div className="enc-line" />

            <div className="enc-node">
              <div className="enc-node-circle">👥</div>
              <span className="enc-node-label">Them</span>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Content ── */}
        <div className="sec-content">
          <div ref={headerRef} className={`sec-header ${headerVisible ? 'visible' : ''}`}>
<p className="sec-eyebrow left-aligned">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Privacy &amp; Security
          </p>
            <h2 className="sec-heading">
              Your conversations.<br />
              <span>Nobody else's.</span>
            </h2>
            <p className="sec-desc">
              Built with a privacy-first mindset from day one. Whether you're catching up
              with family or running a team standup — every call is yours, and yours alone.
            </p>
          </div>

          <div className="sec-cards">
            {FEATURES.map((f, i) => (
              <SecCard key={f.title} feature={f} delay={200 + i * 100} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
