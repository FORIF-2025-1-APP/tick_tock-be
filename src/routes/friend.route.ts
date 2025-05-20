import { Router } from "express";
import {
  addFriend,
  deleteFriend,
  getFriends,
  getFriendSchedule,
} from "../controllers/friend.controller";

const router = Router();

router.post("/friend/request", addFriend);
router.delete("/friend/:friendId", deleteFriend);
router.get("/friend", getFriends);
router.get("/friend/schedule", getFriendSchedule);

export default router;
