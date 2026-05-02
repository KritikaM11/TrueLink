import { useRef, useState, useCallback } from "react";

const useMediaPermissions = () => {
    const localVideoRef = useRef(null);

    const [videoAvailable, setVideoAvailable]   = useState(false);
    const [audioAvailable, setAudioAvailable]   = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [permissionError, setPermissionError] = useState("");

    const getPermission = useCallback(async () => {
        try {
            // Probe each device independently so one denial doesn't block the other
            const videoStream = await navigator.mediaDevices
                .getUserMedia({ video: true })
                .catch(() => null);

            const audioStream = await navigator.mediaDevices
                .getUserMedia({ audio: true })
                .catch(() => null);

            const hasVideo = !!videoStream;
            const hasAudio = !!audioStream;

            setVideoAvailable(hasVideo);
            setAudioAvailable(hasAudio);
            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

            // Release probe streams immediately
            videoStream?.getTracks().forEach((t) => t.stop());
            audioStream?.getTracks().forEach((t) => t.stop());

            if (!hasVideo && !hasAudio) {
                setPermissionError("Camera and microphone access were denied.");
                return;
            }

            // Open a real preview stream for the lobby
            const previewStream = await navigator.mediaDevices.getUserMedia({
                video: hasVideo,
                audio: hasAudio,
            });

            window.localStream = previewStream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = previewStream;
            }
        } catch (err) {
            console.error("getPermission error:", err);
            setPermissionError("Could not access camera/microphone: " + err.message);
        }
    }, []);

    return {
        videoAvailable,
        audioAvailable,
        screenAvailable,
        permissionError,
        localVideoRef,
        getPermission,
    };
};

export default useMediaPermissions;