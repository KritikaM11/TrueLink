import React, { useEffect } from "react";
import { Navbar } from '../layout/Navbar/Navbar'; 
import { useLocation } from 'react-router-dom';
import "../../styles/Lobby.css";

const Lobby = ({ username, setUsername, localVideoRef, permissionError, onConnect, nameError }) => {
    const location = useLocation();
    const meetingCode = location.pathname.replace('/', '');
    const handleKeyDown = (e) => {
        if (e.key === "Enter") onConnect();
    };

    useEffect(() => {
        if (!document.getElementById("vm-fonts")) {
            const link = document.createElement("link");
            link.id = "vm-fonts";
            link.rel = "stylesheet";
            link.href =
                "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap";
            document.head.appendChild(link);
        }

        if (!document.getElementById("vm-anim")) {
            const style = document.createElement("style");
            style.id = "vm-anim";
            style.textContent = `
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -20px) scale(1.05); }
                    66% { transform: translate(-20px, 15px) scale(0.97); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .vm-lobby-panel { animation: fadeUp 0.5s ease both; }
                .vm-lobby-video { animation: fadeUp 0.5s 0.1s ease both; }
                .vm-input:focus {
                    border-color: rgba(0,212,255,0.5) !important;
                    box-shadow: 0 0 0 3px rgba(0,212,255,0.08) !important;
                }
                .vm-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 30px rgba(0,212,255,0.35) !important;
                }
                .vm-btn:active { transform: translateY(0); }
            `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div className="lobby">
            <Navbar className="authnav navlobby" />

            <div className="lobby-grid" >
                {/* Video preview */}
                <div className="lobby-video-wrap vm-lobby-video">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="lobby-video"
                    />
                    <div className="lobby-video-overlay">
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div
                                style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "50%",
                                    background: "#22c55e",
                                    boxShadow: "0 0 6px #22c55e",
                                }}
                            />
                            <span className="lobby-video-label">Camera preview</span>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="lobby-panel vm-lobby-panel">

                    {permissionError && (
                        <p className="error-text">⚠️ {permissionError}</p>
                    )}

                    <div className="lobby-card">
                        <div style={{
                            background: 'rgba(0, 213, 255, 0.13)',
                            border: '2.5px solid rgba(0, 213, 255, 0.45)',
                            borderRadius: '10px',
                            padding: '8px 13px',
                            marginBottom: '16px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '11px', color: '#1D4ED8', margin: '0 0 4px', fontWeight: '500' }}>
                                Meeting Code
                            </p>
                            <p style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#00d4ff',
                                margin: 0,
                                letterSpacing: '2px',
                                fontFamily: 'monospace'
                            }}>
                                {meetingCode}
                            </p>
                        </div>
                        <p className="lobby-card-label">Display name</p>
                        <input
                            type="text"
                            placeholder="e.g. Kritika Mittal"
                            value={username}
                            required={true}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="input vm-input"
                        />
                        {nameError && (
                            <p style={{
                                color: '#f87171',
                                fontSize: '13px',
                                marginTop: '4px',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                ⚠️ {nameError}
                            </p>
                        )}
                        <button onClick={onConnect} className="btn vm-btn">
                            Join Meeting →
                        </button>
                    </div>

                    <p
                        style={{
                            fontSize: "11px",
                            color: "rgba(25, 16, 16, 0.94)",
                            textAlign: "center",
                            fontFamily: "'DM Sans', sans-serif",
                            lineHeight: 1.6,
                            margin: 0,
                        }}
                    >
                        By joining you agree to share audio &amp; video with participants.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Lobby;