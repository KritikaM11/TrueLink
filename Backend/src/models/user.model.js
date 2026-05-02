import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: null,
    },
    tokenExpiry: {
        type: Date
    },
});

const User = mongoose.model("User", userSchema);
export { User };