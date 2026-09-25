import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({ message: "Unauthorized — no token provided" });

        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: 
            "Unauthorized — token is empty" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user)
            return res.status(401).json({ message: "Unauthorized — user not found" });

        req.user = user; 
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired — please log in again"
            });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        console.error("Auth middleware error:", err.message);

        return res.status(500).json({
            message: "Internal server error during authentication"
        });
    }
};