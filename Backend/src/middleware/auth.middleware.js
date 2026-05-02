import { User } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({ message: "Unauthorized — no token provided" });

        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unauthorized — token is empty" });

        const user = await User.findOne({ token });
        if (!user)
            return res.status(401).json({ message: "Unauthorized — invalid or expired token" });
        if (!user.token || user.token !== token) {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (user.tokenExpiry && user.tokenExpiry < new Date()) {
            return res.status(401).json({ message: "Session expired, please log in again" });
        }
        
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        return res.status(500).json({ message: "Internal server error during authentication" });
    }
};