import React, { useEffect, useRef } from "react";
import "../../styles/VideoMeet.css";

const VideoCard = ({ stream, socketId, username, isPinnedArea, isScreen,isMuted,isVideoOff, onPin }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && stream) {
            ref.current.srcObject = stream;
        }
    }, [stream]);

    const shortId  = socketId?.slice(0, 6) ?? "···";
    const label    = username || shortId;
    const initials = label.slice(0, 2).toUpperCase();

    return (
        <div className="video-card">
            <div className="avatar-fallback">
                <div className="avatar-circle">{initials}</div>
            </div>

            <video ref={ref} 
                autoPlay playsInline 
                className={`video ${isScreen ? "video--screen" : ""}`}  
                style={{ opacity: (isVideoOff && !isScreen) ? 0 : 1 }} /* OPACITY FIX */
            />

            {/* ── TOP RIGHT CONTROLS (Grouped) ── */}
            <div className="top-right-badges">
                {onPin && (
                    <button className="pin-btn" onClick={onPin} title={isPinnedArea ? "Unpin" : "Pin"}>
                        {isPinnedArea ? "⤢ Unpin" : "📌 Pin"}
                    </button>
                )}
                {isVideoOff && (
                    <div className="video-off-badge" title="Video is off">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"/><line x1="1" y1="1" x2="23" y2="23"/><path d="m21 10.22-3.1 1.94a2 2 0 0 0-.9 1.68v.32a2 2 0 0 0 .9 1.68L21 17.78A1 1 0 0 0 22.5 17V11a1 1 0 0 0-1.5-.78Z"/></svg>
                    </div>
                )}
                {isMuted && (
                    <div className="mic-off-badge" title="Microphone is off">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </div>
                )}
            </div>

            <span className="name-tag">
                <span className="status-dot remote-dot" />
                {label}
            </span>
        </div>
    );
};

export default VideoCard;