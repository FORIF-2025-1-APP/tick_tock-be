import { Router } from "express";
import {
  addFriend,
  deleteFriend,
  getFriends,
  getFriendSchedule,
} from "../controllers/friend.controller";

const router = Router();

/**
 * @swagger
 * /api/friend/request:
 *   post:
 *     tags:
 *       - friend
 *     summary: 친구 요청 보내기
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendnickname:
 *                 type: string
 *                 example: "김유진"
 *     responses:
 *       200:
 *         description: 친구 요청 전송 성공
 */
router.post("/friend/request", addFriend);

/**
 * @swagger
 * /api/friend/{friendId}:
 *   delete:
 *     tags:
 *       - friend
 *     summary: 친구 삭제
 *     parameters:
 *       - name: friendId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 친구 삭제 성공
 */
router.delete("/friend/:friendId", deleteFriend);

/**
 * @swagger
 * /api/friend:
 *   get:
 *     tags:
 *       - friend
 *     summary: 친구 목록 조회
 *     responses:
 *       200:
 *         description: 친구 목록 반환
 */
router.get("/friend", getFriends);

/**
 * @swagger
 * /api/friend/schedule:
 *   get:
 *     tags:
 *       - friend
 *     summary: 친구 일정 조회
 *     responses:
 *       200:
 *         description: 친구의 일정 정보 반환
 */
router.get("/friend/schedule", getFriendSchedule);

export default router;
