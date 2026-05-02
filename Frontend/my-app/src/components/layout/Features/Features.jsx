import React, { useState } from 'react';
import './Features.css';

const features = [
  {
    id: 0,
    tag: 'Video & Audio',
    title: 'Crystal-clear calls, every time.',
    quote:
      '"True Link gave our remote team the feeling of being in the same room — the audio and video quality is unlike anything else we\'ve tried."',
    bg: 'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 1,
    tag: 'Real-Time Chat',
    title: 'Messages that keep up with you.',
    quote:
      '"The integrated chat means we never lose context from a meeting. Everything is right there, threaded and searchable."',
    bg: 'https://images.unsplash.com/photo-1488998287214-1e668a8e0dc4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    tag: 'Smart Popups',
    title: 'Never miss a message again.',
    quote:
      '"The non-intrusive popup alerts keep me in the loop without pulling me out of flow. I\'ve never missed an important message since."',
    bg: 'https://plus.unsplash.com/premium_photo-1771436938016-08ede7d4a3c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    tag: 'Screen Sharing',
    title: 'Show your work, instantly.',
    quote:
      '"One click and my entire screen is live. Demos, reviews, walkthroughs — screen sharing on True Link is seamless and lag-free."',
    bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
  },
];

export const Features = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="features-section"
      >
      <div className="features-header">
        <p className="features-eyebrow">Why True Link?</p>
        <h2 className="features-heading">Everything you need to connect.</h2>
      </div>

      <div className="cards-row">
        {features.map((f) => {
          const isActive = f.id === active;
          return (
            <div
              key={f.id}
              className={`feat-card ${isActive ? 'feat-card--active' : 'feat-card--collapsed'}`}
              onMouseEnter={() => setActive(f.id)}
              onTouchStart={() => setActive(f.id)}
              style={{ backgroundImage: `url(${f.bg})` }}
            >
              {/* Dark gradient overlay */}
              <div className="feat-overlay" />

              {/* Collapsed state — just the vertical tag */}
              {!isActive && (
                <span className="feat-tag-vertical">{f.tag}</span>
              )}

              {/* Expanded state — full content */}
              {isActive && (
                <div className="feat-content">
                  <span className="feat-tag">{f.tag}</span>
                  <h3 className="feat-title">{f.title}</h3>
                  <blockquote className="feat-quote">{f.quote}</blockquote>

                  <button className="feat-cta">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
