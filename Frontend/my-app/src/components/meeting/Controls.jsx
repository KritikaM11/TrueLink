import React, { useState, useRef, useEffect } from "react";
import "../../styles/Controls.css";

/* ── Icons ── */
const MicIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
);
const MicOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"/>
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
);
const CameraIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
);
const CameraOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);
const ScreenShareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3"/>
        <path d="M8 21h8"/><path d="M12 17v4"/>
        <polyline points="17 8 21 4 17 0"/>
        <line x1="21" y1="4" x2="9" y2="4"/>
    </svg>
);
const ScreenStopIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3"/>
        <path d="M8 21h8"/><path d="M12 17v4"/>
        <rect x="15" y="1" width="6" height="6" rx="1"/>
    </svg>
);
const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);
const PhoneOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
    </svg>
);
const HamburgerIcon = ({ open }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {open ? (
            <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
        ) : (
            <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
        )}
    </svg>
);
const CopyIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
);

const LABELS = {
    mic:    { on: "Mute",        off: "Unmute"      },
    cam:    { on: "Stop Video",  off: "Start Video" },
    screen: { on: "Stop Share",  off: "Share Screen"},
};

const Controls = ({
    video, clock, audio, screen, screenAvailable,
    newMessages, meetingCode,
    onToggleVideo, onToggleAudio, onToggleScreen, onToggleChat,
    onLeaveMeeting, onEndMeetingForAll,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [copied, setCopied]     = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const handleCopy = () => {
        if (!meetingCode) return;
        navigator.clipboard.writeText(meetingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleAction = (fn) => { fn?.(); setMenuOpen(false); };

    const menuItems = [
        { label: audio ? "Mute Mic" : "Unmute Mic",         icon: audio ? <MicIcon /> : <MicOffIcon />,         onClick: () => handleAction(onToggleAudio),  isOff: !audio },
        { label: video ? "Stop Camera" : "Start Camera",    icon: video ? <CameraIcon /> : <CameraOffIcon />,   onClick: () => handleAction(onToggleVideo),  isOff: !video },
        ...(screenAvailable ? [{ label: screen ? "Stop Sharing" : "Share Screen", icon: screen ? <ScreenStopIcon /> : <ScreenShareIcon />, onClick: () => handleAction(onToggleScreen), isGreen: screen }] : []),
        { label: "Chat", icon: <ChatIcon />, onClick: () => handleAction(onToggleChat), badge: newMessages > 0 ? (newMessages > 9 ? "9+" : newMessages) : null },
        { divider: true },
        { label: "Leave Meeting", icon: <PhoneOffIcon />, onClick: () => handleAction(onLeaveMeeting), danger: true },
    ];

    return (
        <>
            {/* ══════════════════════════════
                DESKTOP  (hidden on mobile via CSS)
            ══════════════════════════════ */}
            <div className="controls controls--desktop">
                {clock && (
                    <div className="controls-time" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>{clock}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
                        {meetingCode && (
                            <span
                                style={{ fontFamily: "monospace", fontSize: "16px", color: "rgba(255,255,255,0.93)", letterSpacing: "1.5px", cursor: "pointer", userSelect: "all" }}
                                onClick={() => navigator.clipboard.writeText(meetingCode)}
                                title="Click to copy code"
                            >
                                {meetingCode}
                            </span>
                        )}
                    </div>
                )}

                <button onClick={onToggleAudio} className={`ctrl-btn ${audio ? "" : "ctrl-btn--off"}`} title={audio ? LABELS.mic.on : LABELS.mic.off}>
                    <span className="ctrl-btn__icon">{audio ? <MicIcon /> : <MicOffIcon />}</span>
                </button>

                <button onClick={onToggleVideo} className={`ctrl-btn ${video ? "" : "ctrl-btn--off"}`} title={video ? LABELS.cam.on : LABELS.cam.off}>
                    <span className="ctrl-btn__icon">{video ? <CameraIcon /> : <CameraOffIcon />}</span>
                </button>

                {screenAvailable && (
                    <button onClick={onToggleScreen} className={`ctrl-btn ${screen ? "ctrl-btn--green" : ""}`} title={screen ? LABELS.screen.on : LABELS.screen.off}>
                        <span className="ctrl-btn__icon">{screen ? <ScreenStopIcon /> : <ScreenShareIcon />}</span>
                    </button>
                )}

                <button onClick={onToggleChat} className="ctrl-btn ctrl-btn--chat" title="Toggle Chat">
                    <span className="ctrl-btn__icon"><ChatIcon /></span>
                    {newMessages > 0 && <span className="ctrl-badge">{newMessages > 9 ? "9+" : newMessages}</span>}
                </button>

                <div className="ctrl-divider" />

                <button onClick={onLeaveMeeting} className="ctrl-btn ctrl-btn--end" title="Leave Meeting">
                    <span className="ctrl-btn__icon"><PhoneOffIcon /></span>
                </button>
            </div>

            {/* ══════════════════════════════
                MOBILE  (hidden on desktop via CSS)
            ══════════════════════════════ */}
            <div className="controls controls--mobile">
                {/* Left: clock + code */}
                <div className="ctrl-mobile-left">
                    {clock && <span className="ctrl-clock">{clock}</span>}
                    {clock && meetingCode && <span className="ctrl-sep">|</span>}
                    {meetingCode && (
                        <button className="ctrl-code-btn" onClick={handleCopy} title="Click to copy">
                            <span className="ctrl-code-text">{meetingCode}</span>
                            <span className="ctrl-copy-icon">
                                {copied
                                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    : <CopyIcon />
                                }
                            </span>
                            {copied && <span className="ctrl-copied-toast">Copied!</span>}
                        </button>
                    )}
                </div>

                {/* Right: hamburger + floating menu */}
                <div className="ctrl-mobile-right" ref={menuRef}>
                    <button
                        className={`ctrl-hamburger ${menuOpen ? "ctrl-hamburger--open" : ""}`}
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label="Toggle controls menu"
                    >
                        <HamburgerIcon open={menuOpen} />
                        {newMessages > 0 && !menuOpen && (
                            <span className="ctrl-hamburger-badge">{newMessages > 9 ? "9+" : newMessages}</span>
                        )}
                    </button>

                    {menuOpen && (
                        <div className="ctrl-menu">
                            <div className="ctrl-menu-arrow" />
                            {menuItems.map((item, i) =>
                                item.divider ? (
                                    <div key={`div-${i}`} className="ctrl-menu-divider" />
                                ) : (
                                    <button
                                        key={item.label}
                                        className={`ctrl-menu-item ${item.isOff ? "ctrl-menu-item--off" : ""} ${item.isGreen ? "ctrl-menu-item--green" : ""} ${item.danger ? "ctrl-menu-item--danger" : ""}`}
                                        onClick={item.onClick}
                                    >
                                        <span className={`ctrl-menu-icon ${item.isOff ? "ctrl-menu-icon--off" : ""} ${item.danger ? "ctrl-menu-icon--danger" : ""} ${item.isGreen ? "ctrl-menu-icon--green" : ""}`}>
                                            {item.icon}
                                        </span>
                                        <span className="ctrl-menu-label">{item.label}</span>
                                        {item.badge && <span className="ctrl-menu-badge">{item.badge}</span>}
                                        {item.isOff && <span className="ctrl-menu-status">Off</span>}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Controls;