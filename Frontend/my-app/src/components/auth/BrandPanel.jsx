import React from 'react';

export const BrandPanel = () => (
  <div className="auth-brand-panel">
    <div className="brand-panel-inner">
      <div className="brand-shield">
        <div className="brand-shield-core">
          <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
      </div>
      <div>
        <h2 className="brand-headline">Connect with<br /><span>Confidence.</span></h2>
      </div>
      <p className="brand-sub">
        Your conversations stay private. No recordings, no data sold — just clear, secure calls with the people who matter.
      </p>
    </div>
  </div>
);