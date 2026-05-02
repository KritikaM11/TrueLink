import { useCallback, useRef, useState } from "react";
import { peerConfigConnections } from "../utils/peerConfig";
import { createBlackSilenceStream } from "../utils/mediaUtils";

/*Manages all WebRTC peer connections and the remote video list. */

const useWebRTC = ({ socketRef, socketIdRef }) => {
    const connectionsRef = useRef({});   // socketId -> RTCPeerConnection
    const videoRef       = useRef([]);   // mirrors `videos` for use in callbacks

    const [videos, setVideos] = useState([]);

    // ── Add or update a remote video entry
    const addVideoStream = useCallback((socketListId, stream) => {
        setVideos((prev) => {
            const exists = prev.find((v) => v.socketId === socketListId);
            const updated = exists
                ? prev.map((v) =>
                      v.socketId === socketListId ? { ...v, stream } : v
                  )
                : [...prev, { socketId: socketListId, stream, isMuted: false, isVideoOff: false }];
            videoRef.current = updated;
            return updated;
        });
    }, []);

const getUserMediaSuccess = useCallback(
    (stream) => {
        try {
            window.localStream?.getTracks().forEach((t) => t.stop());
        } catch (e) { console.warn(e); }

        window.localStream = stream;

        const connections = connectionsRef.current;
        Object.entries(connections).forEach(([id, pc]) => {
            if (id === socketIdRef.current) return;

            // Har track ke liye existing sender mein replace karo
            stream.getTracks().forEach((newTrack) => {
                const sender = pc.getSenders().find(
                    (s) => s.track && s.track.kind === newTrack.kind
                );
                if (sender) {
                    sender.replaceTrack(newTrack).catch(console.warn);
                } else {
                    // Pehli baar — sender nahi hai toh addTrack karo
                    pc.addTrack(newTrack, stream);
                }
            });
        });

        // Track end hone pe fallback
        stream.getTracks().forEach((track) => {
            track.onended = () => {
                const fallback = createBlackSilenceStream();
                window.localStream = fallback;
                Object.entries(connectionsRef.current).forEach(([id, pc]) => {
                    fallback.getTracks().forEach((newTrack) => {
                        const sender = pc.getSenders().find(
                            (s) => s.track && s.track.kind === newTrack.kind
                        );
                        if (sender) sender.replaceTrack(newTrack).catch(console.warn);
                    });
                });
            };
        });
    },
    [socketIdRef]
);

    // ── Handle incoming WebRTC signals from other peers ───────────────────────
    const gotMessageFromServer = useCallback(
        (fromId, message) => {
            const signal = JSON.parse(message);
            if (fromId === socketIdRef.current) return;

            const connections = connectionsRef.current;
            if (!connections[fromId]) return;

            if (signal.sdp) {
                connections[fromId]
                    .setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === "offer") {
                            return connections[fromId]
                                .createAnswer()
                                .then((desc) =>
                                    connections[fromId].setLocalDescription(desc)
                                )
                                .then(() => {
                                    socketRef.current.emit(
                                        "signal",
                                        fromId,
                                        JSON.stringify({
                                            sdp: connections[fromId].localDescription,
                                        })
                                    );
                                });
                        }
                    })
                    .catch(console.error);
            }

            if (signal.ice) {
                connections[fromId]
                    .addIceCandidate(new RTCIceCandidate(signal.ice))
                    .catch(console.error);
            }
        },
        [socketRef, socketIdRef]
    );

    // ── Create RTCPeerConnections for every client in the room ────────────────
    const initPeerConnections = useCallback(
        (clients) => {
            const connections = connectionsRef.current;

            clients.forEach((socketListId) => {
                if (connections[socketListId]) return; // already exists

                connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                // ICE candidate handler
                connections[socketListId].onicecandidate = (event) => {
                    if (event.candidate) {
                        socketRef.current.emit(
                            "signal",
                            socketListId,
                            JSON.stringify({ ice: event.candidate })
                        );
                    }
                };

                // Remote stream handler
                connections[socketListId].ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        addVideoStream(socketListId, event.streams[0]);
                    }
                };
                const localStream = window.localStream?.active ? window.localStream : createBlackSilenceStream();
                window.localStream = localStream;
                localStream.getTracks().forEach((track) => {
                    connections[socketListId].addTrack(track, localStream);
                });
            })},
        [socketRef, addVideoStream]
    );

    return {
        connectionsRef,
        videos,
        setVideos,
        videoRef,
        getUserMediaSuccess,
        gotMessageFromServer,
        addVideoStream,
        initPeerConnections,
    };
};

export default useWebRTC;