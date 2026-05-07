import { Router } from "express";
import { joinMeeting, getMeetingHistory, getMeetingMessages,checkMeetingExists } from "../controllers/meeting.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

const existsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({ error: "Too many requests. Please slow down." });
    },
});


router.get("/:code/exists", existsLimiter, checkMeetingExists); 

router.use(authenticate);

router.post("/join",          joinMeeting);
router.get("/history",        getMeetingHistory);
router.get("/:code/messages", getMeetingMessages);

export default router;