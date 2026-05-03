import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useMediaPermissions from './useMediaPermissions';
import useWebRTC from './useWebRTC';
import useSocket from './useSocket';
import {meetingApi} from '../api/index.js';
const getMeetingCode = () => window.location.pathname.replace(/^\/+/, '').split('?')[0];

export const useMeetingRoom = (user) => {
    const navigate = useNavigate();
    const socketIdRef = useRef(null);
    const socketRef = useRef(null);

    // ── States ──
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [nameError, setNameError] = useState("");
    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);
    const [screen, setScreen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [pinnedId, setPinnedId] = useState(null);
    const [page, setPage] = useState(0);

    // ── Refs ──
    const videoTrackRef = useRef(null);
    const knownNamesRef = useRef({});

    // ── Custom Hooks ──
    const { videoAvailable, audioAvailable, screenAvailable, permissionError, localVideoRef, getPermission } = useMediaPermissions();
    const { connectionsRef, videos, setVideos, videoRef, getUserMediaSuccess, gotMessageFromServer, initPeerConnections } = useWebRTC({ socketIdRef, socketRef });
    const { connectToSocketServer } = useSocket({ socketIdRef, socketRef, connectionsRef, gotMessageFromServer, initPeerConnections, setVideos, videoRef, setMessages, setNewMessages, knownNamesRef });

    // ── Clock ──
    const [clock, setClock] = useState(() => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    useEffect(() => {
        const t = setInterval(() => setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })), 30000);
        return () => clearInterval(t);
    }, []);

    // ── Pre-fill user & Permissions ──
    useEffect(() => { if (user?.name) setUsername(user.name); }, [user]);

    // ── NUCLEAR CLEANUP ──
    const stopAllMedia = useCallback(() => {
        if (videoTrackRef.current) {
            videoTrackRef.current.onended = null;
            videoTrackRef.current.stop();
            videoTrackRef.current = null;
        }
        if (window.localStream) {
            window.localStream.getTracks().forEach(track => {
                track.onended = null; track.stop(); track.enabled = false;
            });
            window.localStream = null;
        }
        document.querySelectorAll('video, audio').forEach(mediaElement => {
            if (mediaElement.srcObject) {
                mediaElement.srcObject.getTracks().forEach(track => { track.onended = null; track.stop(); });
                mediaElement.srcObject = null;
            }
            mediaElement.removeAttribute('src');
            mediaElement.load();
        });
        if (connectionsRef.current) {
            Object.values(connectionsRef.current).forEach(pc => {
                pc.getSenders().forEach(sender => { if (sender.track) { sender.track.onended = null; sender.track.stop(); } });
                pc.close();
            });
            connectionsRef.current = {};
        }
    }, [connectionsRef]);

    useEffect(() => {
        const handleBeforeUnload = () => { stopAllMedia(); socketRef.current?.disconnect(); };
        window.addEventListener('beforeunload', handleBeforeUnload);
        getPermission();
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            stopAllMedia();
            socketRef.current?.disconnect();
        };
    }, [getPermission, stopAllMedia]);

    // ── Media Initialization ──
    const getUserMedia = useCallback(async () => {
        if (!videoAvailable && !audioAvailable) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
            stream.getAudioTracks().forEach(t => t.enabled = audio);

            getUserMediaSuccess(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            const vt = stream.getVideoTracks()[0];
            if (vt) videoTrackRef.current = vt;
        } catch (e) { console.error(e); }
    }, [videoAvailable, audioAvailable, audio, getUserMediaSuccess, localVideoRef]);


    // ── Mute/Video Hardware Toggles ──
    useEffect(() => {
        if (window.localStream) window.localStream.getAudioTracks().forEach(t => t.enabled = audio);
    }, [audio]);

    useEffect(() => {
        if (askForUsername || screen) return;
        const toggleCameraHardware = async () => {
            if (video) {
                try {
                    if (videoTrackRef.current) { videoTrackRef.current.onended = null; videoTrackRef.current.stop(); videoTrackRef.current = null; }
                    const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const newVideoTrack = newStream.getVideoTracks()[0];
                    videoTrackRef.current = newVideoTrack;
                    Object.values(connectionsRef.current || {}).forEach(pc => {
                        const sender = pc.getSenders().find(s => s.__isVideo || s.track?.kind === 'video');
                        if (sender) { sender.__isVideo = true; sender.replaceTrack(newVideoTrack); }
                    });
                    if (window.localStream) {
                        window.localStream.getVideoTracks().forEach(t => { t.onended = null; t.stop(); window.localStream.removeTrack(t); });
                        window.localStream.addTrack(newVideoTrack);
                    } else { window.localStream = newStream; }
                    if (localVideoRef.current) localVideoRef.current.srcObject = window.localStream;
                } catch (e) { console.error("Camera restart failed", e); }
            } else {
                if (videoTrackRef.current) { videoTrackRef.current.onended = null; videoTrackRef.current.stop(); videoTrackRef.current = null; }
                if (window.localStream) window.localStream.getVideoTracks().forEach(t => { t.onended = null; t.stop(); });
                Object.values(connectionsRef.current || {}).forEach(pc => {
                    const sender = pc.getSenders().find(s => s.__isVideo || s.track?.kind === 'video');
                    if (sender) { sender.__isVideo = true; sender.replaceTrack(null); }
                });
            }
        };
        toggleCameraHardware();
    }, [video, screen, askForUsername, connectionsRef, localVideoRef]);

    // ── Socket Emissions & Sync ──
    useEffect(() => { if (!askForUsername && socketRef.current) socketRef.current.emit("toggle-mute", !audio); }, [audio, askForUsername]);
    useEffect(() => { if (!askForUsername && socketRef.current) socketRef.current.emit("toggle-video", !video); }, [video, askForUsername]);
    useEffect(() => { if (!askForUsername && socketRef.current && username) socketRef.current.emit("update-username", username); }, [username, askForUsername]);

    useEffect(() => {
        const socket = socketRef.current;
        if (!askForUsername && socket) {
            const onMute = (id, isMuted) => setVideos(prev => prev.map(v => v.socketId === id ? { ...v, isMuted } : v));
            const onVideo = (id, isVideoOff) => setVideos(prev => prev.map(v => v.socketId === id ? { ...v, isVideoOff } : v));
            const onUsername = (id, remoteUsername) => setVideos(prev => prev.map(v => v.socketId === id ? { ...v, username: remoteUsername } : v));
            const handleUserJoined = () => setTimeout(() => { socket.emit("toggle-mute", !audio); socket.emit("toggle-video", !video); socket.emit("update-username", username); }, 1000);

            socket.on("user-toggled-mute", onMute);
            socket.on("user-toggled-video", onVideo);
            socket.on("user-updated-username", onUsername);
            socket.on("user-joined", handleUserJoined);

            return () => {
                socket.off("user-toggled-mute", onMute); socket.off("user-toggled-video", onVideo);
                socket.off("user-updated-username", onUsername); socket.off("user-joined", handleUserJoined);
            };
        }
    }, [askForUsername, audio, video, username, setVideos]);

    useEffect(() => {
        if (!askForUsername && socketRef.current && username) socketRef.current.emit("update-username", username);
        if (Object.keys(knownNamesRef.current).length > 0) {
            setVideos(prev => {
                const updated = prev.map(v => (!v.username && knownNamesRef.current[v.socketId]) ? { ...v, username: knownNamesRef.current[v.socketId] } : v);
                return updated.some((v, i) => v !== prev[i]) ? updated : prev;
            });
        }
    }, [videos.length, askForUsername, username, setVideos]);

    // ── Layout & Actions ──
    useEffect(() => { if (pinnedId && pinnedId !== "local" && !videos.some((v) => v.socketId === pinnedId)) setPinnedId(null); }, [videos, pinnedId]);
    useEffect(() => { if (localVideoRef.current && window.localStream) localVideoRef.current.srcObject = window.localStream; }, [pinnedId, askForUsername, videos.length, localVideoRef]);
    useEffect(() => { if (showChat) setNewMessages(0); }, [messages, showChat]);

    const handleConnect = async () => {
        if (!username.trim()) { setNameError("Please enter a valid display name."); return; }
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        setAskForUsername(false);
        if (window.localStream) {
            const vt = window.localStream.getVideoTracks()[0];
            if (vt) videoTrackRef.current = vt;
        }
        const isGuest = !localStorage.getItem("tl_user");
        connectToSocketServer(username, isGuest);
    };

    const handleToggleScreen = async () => {
        if (!screen) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: false });
                const screenTrack = screenStream.getVideoTracks()[0];

                Object.values(connectionsRef.current || {}).forEach(pc => {
                    const sender = pc.getSenders().find(s => s.__isVideo || s.track?.kind === 'video');
                    if (sender) { sender.__isVideo = true; sender.replaceTrack(screenTrack); }
                });

                // Safely replace ONLY the video track locally (Preserving the mic!)
                if (window.localStream) {
                    window.localStream.getVideoTracks().forEach(t => { t.stop(); window.localStream.removeTrack(t); });
                    window.localStream.addTrack(screenTrack);
                }

                if (localVideoRef.current) localVideoRef.current.srcObject = window.localStream;
                setScreen(true);
                setPinnedId("local");

                screenTrack.onended = () => {
                    setScreen(false);
                    setPinnedId(null);
                }
            } catch (e) { console.error(e); }
        } else {
            setScreen(false);
            setPinnedId(null);
        }
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        socketRef.current?.emit("chat-message", message, username);

        setMessages(prev => [...prev, {
            data: message,
            sender: username,
            senderSocketId: socketRef.current?.id || "local"
        }]);

        setMessage("");
    };

    const handleLeaveMeeting = () => {
        stopAllMedia();
        socketRef.current?.disconnect();
        sessionStorage.removeItem('tl_guest');
        setVideos([]); setPinnedId(null); setPage(0);
        navigate("/", { replace: true });
    };

    const handlePin = (id, e) => { e.stopPropagation(); setPinnedId(prev => prev === id ? null : id); };

    return {
        // UI States
        askForUsername, username, setUsername, nameError, clock,
        video, setVideo, audio, setAudio, screen,
        showChat, setShowChat, messages, message, setMessage, newMessages, setNewMessages,
        pinnedId, page, setPage,
        // WebRTC Data
        videos, localVideoRef, permissionError, screenAvailable,
        // Actions
        handleConnect, handleToggleScreen, handleSendMessage, handleLeaveMeeting, handlePin,
        getMeetingCode
    };
};