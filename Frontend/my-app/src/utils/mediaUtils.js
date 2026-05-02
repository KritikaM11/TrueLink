/**
 * Media utility helpers for WebRTC fallback streams.
 */

/** Returns a silent (muted) audio track */
export const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
};

/** Returns a black video track of given dimensions */
export const black = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
};

/** Creates a MediaStream that is fully black and fully silent — used when
 *  the user has no camera/mic or has toggled both off */
export const createBlackSilenceStream = () =>
    new MediaStream([black({ width: 640, height: 480 }), silence()]);