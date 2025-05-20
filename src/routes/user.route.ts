import { Router } from "express";
import {
  updateProfileImage,
  changePassword,
  updateNickname,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.patch("/user/profile-image", updateProfileImage);
router.patch("/user/password", changePassword);
router.patch("/user/nickname", updateNickname);
router.delete("/user", deleteUser);

export default router;
