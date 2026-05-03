import React from "react";
import Lobby from "../components/meeting/Lobby";
import Controls from "../components/meeting/Controls";
import ChatPanel from "../components/meeting/ChatPanel";
import { MeetingHeader } from "../components/meeting/MeetingHeader";
import { PaginationBar } from "../components/meeting/PaginationBar";
import { OneOnOneLayout } from "../components/meeting/OneOnOneLayout";
import { PinnedLayout } from "../components/meeting/PinnedLayout";
import { GridLayout } from "../components/meeting/GridLayout";

import { useMeetingRoom } from "../hooks/useMeetingRoom";
import { useAuth } from "../contexts/AuthContext";
import "../Styles/VideoMeet.css";

const PAGE_SIZE = 16;
function getGridDimensions(count) {
    if (count <= 1) return { cols: 1, rows: 1 };
    if (count <= 2) return { cols: 2, rows: 1 };
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 6) return { cols: 3, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    if (count <= 12) return { cols: 4, rows: 3 };
    return { cols: 4, rows: 4 };
}

export const VideoMeet = () => {
    const { user } = useAuth();

    const room = useMeetingRoom(user);

    // ── LOBBY VIEW ──
    if (room.askForUsername) {
        return (
            <Lobby
                username={room.username} setUsername={room.setUsername}
                localVideoRef={room.localVideoRef} permissionError={room.permissionError}
                onConnect={room.handleConnect} nameError={room.nameError}
            />
        );
    }

    // ── DATA PREPARATION FOR ACTIVE ROOM ──
    const allParticipants = [
        { id: "local", isLocal: true },
        ...room.videos.map((v) => ({ id: v.socketId, isLocal: false, ...v })),
    ];

    const totalParticipants = allParticipants.length;
    const totalPages = Math.ceil(totalParticipants / PAGE_SIZE);
    const currentPage = Math.min(room.page, totalPages - 1);
    const pageTiles = allParticipants.slice(currentPage * PAGE_SIZE, (currentPage * PAGE_SIZE) + PAGE_SIZE);

    const { cols, rows } = getGridDimensions(pageTiles.length);
    const pinnedVideo = room.videos.find((v) => v.socketId === room.pinnedId);

    // Reusable UI tile for the local user
    const localVideoTile = (
        <div className="video-card local-tile">
            <video
                ref={room.localVideoRef} autoPlay muted playsInline
                className={`video ${room.screen ? "video--screen" : ""}`}
                style={{ opacity: (room.video || room.screen) ? 1 : 0 }}
            />
            <div className="top-right-badges">
                <button className="pin-btn" onClick={(e) => room.handlePin("local", e)}>
                    {room.pinnedId === "local" ? "⤢ Unpin" : "📌 Pin"}
                </button>
                {!room.video && (
                    <div className="video-off-badge" title="Video is off">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                            <path d="m21 10.22-3.1 1.94a2 2 0 0 0-.9 1.68v.32a2 2 0 0 0 .9 1.68L21 17.78A1 1 0 0 0 22.5 17V11a1 1 0 0 0-1.5-.78Z" />
                        </svg>
                    </div>
                )}
                {!room.audio && (
                    <div className="mic-off-badge" title="Microphone is off">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="1" y1="1" x2="23" y2="23" />
                            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                    </div>
                )}
            </div>
            <span className="name-tag">
                <span className="status-dot local-dot" /> {room.username} (you)
            </span>
        </div>
    );

    // ── ACTIVE ROOM VIEW ──
    return (
        <div className="meeting-root">
            <div className="meeting-bg" />

            <MeetingHeader totalParticipants={totalParticipants} />

            <div className="meeting-body">
                <div className="meeting-main">

                    {/* ── DYNAMIC LAYOUT MANAGER ── */}
                    {totalParticipants === 2 && !room.pinnedId && room.videos[0] ? (
                        <OneOnOneLayout remoteVideo={room.videos[0]} localVideoTile={localVideoTile} handlePin={room.handlePin} />
                    ) : room.pinnedId ? (
                        <PinnedLayout
                            pinnedId={room.pinnedId} pinnedVideo={pinnedVideo}
                            localVideoTile={localVideoTile} videos={room.videos}
                            screen={room.screen} handlePin={room.handlePin}
                        />
                    ) : (
                        <GridLayout pageTiles={pageTiles} localVideoTile={localVideoTile} cols={cols} rows={rows} handlePin={room.handlePin} />
                    )}

                    {/* ── PAGINATION BAR ── */}
                    {!room.pinnedId && totalPages > 1 && (
                        <PaginationBar currentPage={currentPage} totalPages={totalPages} setPage={room.setPage} />
                    )}

                    {/* ── CONTROLS ── */}
                    <Controls
                        video={room.video} clock={room.clock} audio={room.audio} screen={room.screen}
                        screenAvailable={room.screenAvailable} newMessages={room.newMessages}
                        meetingCode={room.getMeetingCode()}
                        onToggleVideo={() => room.setVideo(v => !v)}
                        onToggleAudio={() => room.setAudio(a => !a)}
                        onToggleScreen={room.handleToggleScreen}
                        onToggleChat={() => { room.setShowChat(c => !c); room.setNewMessages(0); }}
                        onLeaveMeeting={room.handleLeaveMeeting}
                    />
                </div>

                {/* ── CHAT PANEL ── */}
                {room.showChat && (
                    <ChatPanel
                        messages={room.messages} message={room.message} setMessage={room.setMessage}
                        onSend={room.handleSendMessage} onClose={() => room.setShowChat(false)}
                    />
                )}
            </div>
        </div>
    );
};