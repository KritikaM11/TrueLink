import { Server } from "socket.io";
import { Meeting } from "../models/meeting.model.js";

let connections = {};   // roomPath → [socketId, ...]
let messages = {};   // roomPath → [{ sender, data, socket-id-sender }, ...]
let timeOnline = {};   // socketId → Date

const extractCode = (path) => {
    const m = path.match(/([a-z]{3}-[a-z]{4}-[a-z]{3})/);
    return m ? m[1] : null;
};

const findRoom = (socketId) =>
    Object.entries(connections).find(([, members]) => members.includes(socketId))?.[0];

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_ORIGIN || "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("join-call", (path) => {
            if (!path || typeof path !== "string") return;
            connections[path] ??= [];
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[path].forEach((id) =>
                io.to(id).emit("user-joined", socket.id, connections[path])
            );

            messages[path]?.forEach((msg) =>
                io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"])
            );
        });

        socket.on("register-participant", async ({ name, username, isGuest }) => {
            const room = findRoom(socket.id);
            const code = room && extractCode(room);
            if (!code) return;

            try {
                let meeting = await Meeting.findOne({ meeting_code: code });

                if (!meeting) {
                    meeting = new Meeting({
                        meeting_code: code,
                        host: name,
                        started_at: new Date(),
                        participants: [],
                    });
                } else if (!meeting.host || meeting.host === "Unknown") {
                    meeting.host = name;
                }

                const alreadyIn = meeting.participants.some(
                    (p) => (username && p.username === username) ||
                        (!username && p.isGuest && p.name === name)
                );

                if (!alreadyIn) {
                    meeting.participants.push({
                        name,
                        username: username || null,
                        isGuest: !!isGuest,
                    });
                }

                await meeting.save();
            } catch (err) {
                console.error("Error saving participant:", err.message);
            }
        });

        socket.on("signal", (toID, message) => {
            if (toID && message) io.to(toID).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            if (!data || !sender) return;
            if (typeof data !== "string" || data.length > 500) return;
            if (typeof sender !== "string" || sender.length > 100) return;
            const room = findRoom(socket.id);
            if (!room) return;

            messages[room] ??= [];
            messages[room].push({ sender, data, "socket-id-sender": socket.id });

            connections[room].forEach((id) =>
                io.to(id).emit("chat-message", data, sender, socket.id)
            );

            const code = extractCode(room);
            if (code) {
                Meeting.findOneAndUpdate(
                    { meeting_code: code },
                    { $push: { messages: { sender, text: data, timestamp: new Date() } } }
                ).catch(console.error);
            }
        });

        socket.on("toggle-mute", (isMuted) => {
            const room = findRoom(socket.id);
            room && connections[room].forEach((id) => {
                if (id !== socket.id)
                    io.to(id).emit("user-toggled-mute", socket.id, isMuted);
            });
        });

        socket.on("toggle-video", (isVideoOff) => {
            const room = findRoom(socket.id);
            room && connections[room].forEach((id) => {
                if (id !== socket.id)
                    io.to(id).emit("user-toggled-video", socket.id, isVideoOff);
            });
        });

        socket.on("update-username", (username) => {
            const room = findRoom(socket.id);
            room && connections[room].forEach((id) => {
                if (id !== socket.id)
                    io.to(id).emit("user-updated-username", socket.id, username);
            });
        });

        socket.on("disconnect", () => {
            const elapsed = timeOnline[socket.id]
                ? Math.abs(new Date() - timeOnline[socket.id])
                : 0;
            console.log(`Socket ${socket.id} disconnected (online ${elapsed}ms)`);
            delete timeOnline[socket.id];

            for (const [roomPath, members] of Object.entries(connections)) {
                const idx = members.indexOf(socket.id);
                if (idx === -1) continue;

                // Notify others before removing
                members.forEach((id) => io.to(id).emit("user-left", socket.id));
                members.splice(idx, 1);

                if (members.length === 0) {
                    const code = extractCode(roomPath);
                    if (code) {
                        Meeting.findOneAndUpdate(
                            { meeting_code: code, ended_at: null },
                            { $set: { ended_at: new Date() } }
                        ).catch(console.error);
                    }
                    delete connections[roomPath];
                    delete messages[roomPath];
                }
                break;
            }
        });
    });

    return io;
};

export const getActiveRooms = () => connections;