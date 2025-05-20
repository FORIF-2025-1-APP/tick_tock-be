import { Router } from "express";
import {
  register,
  checkEmail,
  login,
  googleLogin,
  resetPassword,
} from "../controllers/auth.controller";
// import { register, checkEmail, login } from "../controllers/auth.controller";

const router = Router();

// router.post("/register", register);
// router.post("/checkemail", checkEmail);
// router.post("/login", login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
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
router.post("/register", register);

/**
 * @swagger
 * /api/auth/checkemail:
 *   post:
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
router.post("/checkemail", checkEmail);

router.post("/login", login);
router.post("/google", googleLogin);
router.post("/resetpassword", resetPassword); // 비밀번호 변경

export default router;
