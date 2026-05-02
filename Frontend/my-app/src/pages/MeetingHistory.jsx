import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { meetingApi } from "../api/index.js";
import { Navbar } from "../components/layout/Navbar/Navbar";

const formatDateTime = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
    });

const formatDuration = (startIso, endIso) => {
    if (!endIso) return "Ongoing";
    const mins = Math.round((new Date(endIso) - new Date(startIso)) / 60000);
    if (mins < 1)  return "Less than a minute";
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60), m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

const StatPill = ({ icon, label, color = "#475569" }) => (
    <div style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 20,
        background: "rgba(241,245,249,1)", border: "1px solid #e2e8f0",
        color, fontSize: 12, fontWeight: 600,
    }}>
        <span style={{ color, display: "flex" }}>{icon}</span>
        {label}
    </div>
);

export const MeetingHistory = () => {
    const navigate = useNavigate();
    const { user, authLoading } = useAuth();

    const [meetings, setMeetings] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [chatData, setChatData] = useState({});
    const [chatLoad, setChatLoad] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate("/auth?mode=login"); return; }

        meetingApi.history()
            .then((data) => setMeetings(data.meetings || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user, authLoading, navigate]);

    const handleExpand = async (code) => {
        if (expanded === code) { setExpanded(null); return; }
        setExpanded(code);
        if (chatData[code]) return;

        setChatLoad(true);
        try {
            const data = await meetingApi.messages(code);
            setChatData((prev) => ({
                ...prev,
                [code]: { messages: data.messages || [], participants: data.participants || [] },
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setChatLoad(false);
        }
    };

    // ── JSX unchanged from original (layout/styles preserved) ──
    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
            <Navbar className="authnav" />
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "6.5rem 1.5rem 4rem" }}>
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
                        Past Meetings
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
                        Your meeting history, participants and in-call chats
                    </p>
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "5rem", color: "#94a3b8" }}>
                        <div style={{ width: 28, height: 28, border: "3px solid #e2e8f0", borderTopColor: "#1d4ed8", borderRadius: "50%", animation: "spin 0.75s linear infinite", margin: "0 auto 14px" }} />
                        Loading your meetings…
                    </div>
                )}

                {!loading && meetings.length === 0 && (
                    <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 22px" }}>No meetings yet. Start or join a meeting to see your history here.</p>
                        <button onClick={() => navigate("/")} style={{ padding: "0.7rem 1.8rem", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                            Go to Home
                        </button>
                    </div>
                )}

                {!loading && meetings.map((m) => {
                    const isOpen = expanded === m.meeting_code;
                    const chat   = chatData[m.meeting_code];
                    return (
                        <div key={m.meeting_code} style={{ marginBottom: 14 }}>
                            <div onClick={() => handleExpand(m.meeting_code)} style={{ background: "#fff", border: `1.5px solid ${isOpen ? "#1d4ed8" : "#e2e8f0"}`, borderRadius: isOpen ? "16px 16px 0 0" : 16, padding: "20px 22px", cursor: "pointer", boxShadow: isOpen ? "0 0 0 3px rgba(29,78,216,0.08)" : "0 1px 5px rgba(0,0,0,0.05)", transition: "border-color 0.2s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>{formatDateTime(m.started_at)}</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                            <StatPill icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label={formatDuration(m.started_at, m.ended_at)} />
                                            <StatPill icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>} label={`Host: ${m.host || "Unknown"}`} color="#7c3aed" />
                                            <StatPill icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} label={`${m.participants?.length || 0} participant${m.participants?.length !== 1 ? "s" : ""}`} />
                                        </div>
                                    </div>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.22s ease", flexShrink: 0, marginTop: 2 }}><polyline points="6 9 12 15 18 9"/></svg>
                                </div>
                            </div>

                            {isOpen && (
                                <div style={{ background: "#fff", border: "1.5px solid #1d4ed8", borderTop: "1px solid #e2e8f0", borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
                                    <div style={{ padding: "14px 22px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Participants</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                            {(chat?.participants || m.participants || []).map((p, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: p.isGuest ? "rgba(100,116,139,0.08)" : "rgba(29,78,216,0.07)", border: `1px solid ${p.isGuest ? "rgba(100,116,139,0.2)" : "rgba(29,78,216,0.15)"}` }}>
                                                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: p.isGuest ? "#e2e8f0" : "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: p.isGuest ? "#64748b" : "#fff" }}>
                                                        {p.isGuest ? "?" : p.name?.slice(0, 1).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: p.isGuest ? "#64748b" : "#1d4ed8" }}>{p.isGuest ? "Guest" : p.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ padding: "14px 22px 18px" }}>
                                        <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>In-call Messages</p>
                                        {chatLoad && <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "1rem" }}>Loading messages…</p>}
                                        {!chatLoad && chat?.messages?.length === 0 && (
                                            <p style={{ color: "#cbd5e1", fontSize: 13, textAlign: "center", padding: "1.5rem 0" }}>No messages were sent in this meeting.</p>
                                        )}
                                        {!chatLoad && (
                                            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                                                {chat?.messages?.map((msg, i) => (
                                                    <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "9px 13px" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                            <span style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", fontFamily: "'Outfit', sans-serif" }}>{msg.sender}</span>
                                                            <span style={{ fontSize: 11, color: "#cbd5e1" }}>{formatTime(msg.timestamp)}</span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{msg.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};