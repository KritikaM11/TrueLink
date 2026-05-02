import React from 'react';
import './NoMeetingModal.css';

const NoMeetingModal = ({ code, onStartNew, onClose }) => {
    return (
        <div className="no-meeting-overlay">
            <div className="no-meeting-modal">

                {/* Icon */}
                <div className="no-meeting-icon">
                    <svg viewBox="0 0 24 24" fill="none"
                        stroke="#ef4444" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                {/* Title */}
                <h3 className="no-meeting-title">
                    No active meeting found
                </h3>

                {/* Subtitle */}
                <p className="no-meeting-subtitle">
                    The code{' '}
                    <span className="no-meeting-code-badge">{code}</span>
                    {' '}doesn't match any ongoing meeting right now.
                </p>

                {/* Divider */}
                <div className="no-meeting-divider" />

                <p className="no-meeting-hint">
                    Want to start a new meeting instead?
                </p>

                {/* Buttons */}
                <div className="no-meeting-actions">
                    <button className="no-meeting-btn-start" onClick={onStartNew}>
                        <svg viewBox="0 0 24 24">
                            <path d="M23 7l-7 5 7 5V7z" />
                            <rect x="1" y="5" width="15" height="14" rx="2" />
                        </svg>
                        Start a new meeting
                    </button>

                    <button className="no-meeting-btn-cancel" onClick={onClose}>
                        Go back
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NoMeetingModal;