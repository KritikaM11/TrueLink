import { useCallback, useRef } from "react";
import io from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SOCKET_URL  || "http://localhost:8080";

const useSocket = ({
    socketIdRef,
    socketRef,
    connectionsRef,
    gotMessageFromServer,
    initPeerConnections,
    setVideos,
    videoRef,
    setMessages,
    setNewMessages,
}) => {

    const connectToSocketServer = useCallback((username, isGuest) => {
        socketRef.current = io.connect(SERVER_URL, { secure: false });

        // ── WebRTC signalling ──
        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {
            const meetingCode = window.location.pathname.replace(/^\/+/, '').split('?')[0];
            socketRef.current.emit("join-call", meetingCode);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.emit("register-participant", {
                name: username,
                username: isGuest ? null : username,
                isGuest: isGuest
            });
            
            // ── Incoming chat message ──
            socketRef.current.on("chat-message", (data, sender, senderSocketId) => {
                if (senderSocketId === socketIdRef.current) {
                    return;
                }

                setMessages((prev) => [...prev, { data, sender, senderSocketId }]);
                setNewMessages((n) => n + 1);
            });

            // ── A peer left ──
            socketRef.current.on("user-left", (id) => {
                setVideos((prev) => {
                    const updated = prev.filter((v) => v.socketId !== id);
                    videoRef.current = updated;
                    return updated;
                });
                delete connectionsRef.current[id];
            });

            // ── Someone joined (including ourselves) ──
            socketRef.current.on("user-joined", (id, clients) => {
                // Create peer connections for all clients in the room
                initPeerConnections(clients);

                // Only the new joiner creates offers to existing peers
                if (id === socketIdRef.current) {
                    Object.entries(connectionsRef.current).forEach(([id2, pc]) => {
                        if (id2 === socketIdRef.current) return;

                        try {
                            window.localStream?.getTracks().forEach((track) => {
                                const alreadySending = pc.getSenders().find(
                                    (s) => s.track?.kind === track.kind
                                );
                                if (!alreadySending) {
                                    pc.addTrack(track, window.localStream);
                                }
                            });
                        } catch (_) {
                            /* tracks already added */
                        }

                        pc.createOffer()
                            .then((desc) => pc.setLocalDescription(desc))
                            .then(() => {
                                socketRef.current.emit(
                                    "signal",
                                    id2,
                                    JSON.stringify({ sdp: pc.localDescription })
                                );
                            })
                            .catch(console.error);
                    });
                }
            });
        });
    }, [
        socketIdRef,
        connectionsRef,
        gotMessageFromServer,
        initPeerConnections,
        setVideos,
        videoRef,
        setMessages,
        setNewMessages,
    ]);

    return { connectToSocketServer };
};

export default useSocket;