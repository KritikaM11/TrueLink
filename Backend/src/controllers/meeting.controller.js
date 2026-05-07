import { Meeting } from "../models/meeting.model.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { getActiveRooms } from "../sockets/socketManager.js";

export const checkMeetingExists = wrapAsync(async (req, res) => {
    const { code } = req.params;

    const MEETING_CODE_REGEX = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
    if (!MEETING_CODE_REGEX.test(code)) {
        return res.status(400).json({ exists: false, message: "Invalid meeting code format." });
    }

    // 1. Check live in-memory rooms first (fastest)
    const activeRooms = getActiveRooms();
    const inMemory = Object.keys(activeRooms).some(
        (path) => path.includes(code) && activeRooms[path].length > 0
    );
    if (inMemory) return res.status(200).json({ exists: true });

    // 2. Fall back to DB — only rooms that were started and not yet ended are valid
    const meeting = await Meeting.findOne({ meeting_code: code });

    if (!meeting) {
        return res.status(200).json({ exists: false, message: "No meeting found with this code." });
    }

    if (meeting.ended_at) {
        return res.status(200).json({ exists: false, message: "This meeting has ended." });
    }

    if (meeting.expires_at && meeting.expires_at < new Date()) {
         await Meeting.findOneAndUpdate(
            { meeting_code: code },
            { $set: { ended_at: new Date() } }
        );
        return res.status(200).json({ exists: false, message: "This meeting code has expired." });
    }

    return res.status(200).json({ exists: true });
});

export const joinMeeting = wrapAsync(async (req, res) => {
    const { meeting_code } = req.body;
    if (!meeting_code)
        return res.status(400).json({ message: "meeting_code is required" });

    const { user } = req;

    const existingMeeting = await Meeting.findOne({ meeting_code });
    if (existingMeeting && existingMeeting.ended_at) {
        return res.status(403).json({ message: "This meeting code is no longer valid." });
    }
    
    await Meeting.findOneAndUpdate(
        { meeting_code },
        {
            $setOnInsert: { created_at: new Date(), host: user.name },
            $addToSet: {
                participants: { username: user.username, name: user.name },
            },
        },
        { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Joined meeting recorded" });
});

export const getMeetingHistory = wrapAsync(async (req, res) => {
    const { user } = req;

    const meetings = await Meeting.find(
        {
            "participants.username": user.username,
            "participants.1": { $exists: true }, // at least 2 participants
        },
        { meeting_code: 1, started_at: 1, ended_at: 1, host: 1, participants: 1 }
    ).sort({ started_at: -1 });

    return res.status(200).json({ meetings });
});

export const getMeetingMessages = wrapAsync(async (req, res) => {
    const { user } = req;
    const { code } = req.params;

    const meeting = await Meeting.findOne({
        meeting_code: code,
        "participants.username": user.username,
    });

    if (!meeting)
        return res.status(404).json({ message: "Meeting not found or access denied" });

    return res.status(200).json({ messages: meeting.messages, participants: meeting.participants });
});