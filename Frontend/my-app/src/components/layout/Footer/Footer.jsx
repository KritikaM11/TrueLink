import React from 'react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-divider" />

      <div className="footer-main">

        <div className="footer-brand">
          <div className="footer-logo">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: 'rotate(-10deg)' }}
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#3b82f6" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#1e3a8a" />
            </svg>
            <span className="footer-logo-text">True Link</span>
          </div>
          <p className="footer-tagline">
            Crystal-clear video calls, real-time messaging, and seamless collaboration — all in one place.
          </p>
          <div className="footer-social">
            {/* Twitter / X */}
            <button className="social-btn" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            {/* LinkedIn */}
            <button className="social-btn" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </button>
            {/* GitHub */}
            <button className="social-btn" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </button>
            {/* YouTube */}
            <button className="social-btn" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Product</span>
          <a className="footer-link">Features</a>
          <a className="footer-link">Pricing</a>
          <a className="footer-link">Changelog</a>
          <a className="footer-link">Roadmap</a>
          <a className="footer-link">Integrations</a>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Company</span>
          <a className="footer-link">About</a>
          <a className="footer-link">Blog</a>
          <a className="footer-link">Careers</a>
          <a className="footer-link">Press Kit</a>
          <a className="footer-link">Contact</a>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Support</span>
          <a className="footer-link">Help Center</a>
          <a className="footer-link">Community</a>
          <a className="footer-link">Status</a>
          <a className="footer-link">Security</a>
          <a className="footer-link">Developers</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 True Link. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a>Privacy Policy</a>
          <a>Terms of Service</a>
          <a>Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};
