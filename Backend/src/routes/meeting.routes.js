import { Router } from "express";
import { joinMeeting, getMeetingHistory, getMeetingMessages,checkMeetingExists  } from "../controllers/meeting.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:code/exists", checkMeetingExists); 

router.use(authenticate);

router.post("/join",          joinMeeting);
router.get("/history",        getMeetingHistory);
router.get("/:code/messages", getMeetingMessages);

export default router;