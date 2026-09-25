import { User } from "../models/user.model.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = wrapAsync(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: "Provide username and password" });

    const user = await User.findOne({ username });
    if (!user)
        return res.status(httpStatus.NOT_FOUND).json({ message: "User not found — please register" });

    if (!await bcrypt.compare(password, user.password))
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid password" });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(httpStatus.OK).json({
        message: "Logged in successfully",
        token,
        name: user.name });
});

export const register = wrapAsync(async (req, res) => {
    const { name, username, password } = req.body;

    if (await User.findOne({ username }))
        return res.status(httpStatus.FOUND).json({ message: "Username already taken" });

    const newUser = new User({
        name,
        username,
        password: await bcrypt.hash(password, 10),
    });
    await newUser.save();

    return res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
});

export const verifyToken = wrapAsync(async (req, res) => {
    const { user } = req; 
    return res.status(200).json({ valid: true, name: user.name, username: user.username });
});