import { Router } from "express";
import {
  updateProfileImage,
  changePassword,
  updateNickname,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /api/user/profile-image:
 *   patch:
 *     tags:
 *       - user
 *     summary: 프로필 이미지 변경
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 example: "https://example.com/profile.png"
 *     responses:
 *       200:
 *         description: 프로필 이미지 변경 성공
 */
router.patch("/user/profile-image", updateProfileImage);

/**
 * @swagger
 * /api/user/password:
 *   patch:
 *     tags:
 *       - user
 *     summary: 비밀번호 변경
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldPass123"
 *               newPassword:
 *                 type: string
 *                 example: "newPass456"
 *               newPasswordConfirm:
 *                 type: string
 *                 example: "newPass456"
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *       400:
 *         description: 비밀번호 오류
 */
router.patch("/user/password", changePassword);

/**
 * @swagger
 * /api/user/nickname:
 *   patch:
 *     tags:
 *       - user
 *     summary: 닉네임 변경
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "유경짱"
 *     responses:
 *       200:
 *         description: 닉네임 변경 성공
 */
router.patch("/user/nickname", updateNickname);

/**
 * @swagger
 * /api/user:
 *   delete:
 *     tags:
 *       - user
 *     summary: 회원 탈퇴
 *     responses:
 *       200:
 *         description: 회원 탈퇴 성공
 */
router.delete("/user", deleteUser);

export default router;
