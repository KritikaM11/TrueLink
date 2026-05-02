import { meetingApi } from "../api/index.js";

export const generateMeetingCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const rand = (n) =>
        Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${rand(3)}-${rand(4)}-${rand(3)}`;
};

export const sanitizeCode = (code) =>
    code.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

export const checkRoomExists = async (code) => {
    try {
        const data = await meetingApi.checkExists(code);
        return data.exists;
    } catch {
        return false;
    }
};