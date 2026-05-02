/**
 * WebRTC peer connection configuration.
 * Add a TURN server entry for production to handle strict NAT environments.
 */
export const peerConfigConnections = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        // {
        //   urls: "turn:your-turn-server.com",
        //   username: "your-username",
        //   credential: "your-password",
        // },
    ],
};