import mongoose from "mongoose";
const { Schema } = mongoose;

const participantSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, default: null },
    isGuest: { type: Boolean, default: false },
}, { _id: false });

const messageSchema = new Schema({
    sender: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });

const meetingSchema = new Schema({
    meeting_code: { type: String, required: true, unique: true },
    host: { type: String, default: "Unknown" },
    started_at: { type: Date, default: Date.now },
    ended_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
    participants: [participantSchema],
    messages: [messageSchema],
});

const Meeting = mongoose.model("Meeting", meetingSchema);
export { Meeting };