import { Router, RequestHandler } from "express";
import {
  register,
  checkEmail,
  login,
  googleLogin,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
router.post("/register", register as RequestHandler);

/**
 * @swagger
 * /api/auth/checkemail:
 *   post:
 *     tags:
 *       - auth
 *     summary: 이메일 중복 확인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 중복 여부 반환
 */
router.post("/checkemail", checkEmail);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 로그인 실패
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     tags:
 *       - auth
 *     summary: 구글 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 구글 로그인 성공
 */
router.post("/google", googleLogin);

/**
 * @swagger
 * /api/auth/resetpassword:
 *   post:
 *     tags:
 *       - auth
 *     summary: 비밀번호 찾기
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 임시 비밀번호 전송됨
 *       404:
 *         description: 해당 이메일 없음
 */
router.post("/resetpassword", resetPassword);

export default router;
