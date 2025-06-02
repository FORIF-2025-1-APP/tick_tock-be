import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  addTodo,
  updateTodoCategory,
  deleteTodo,
  bringTodo,
  bringTodoDoneCount,
  updateTodoDone,
} from "../controllers/todo.controller";

const router = Router();

/**
 * @swagger
 * /api/todo/addtodo:
 *   post:
 *     tags:
 *       - todo
 *     summary: 투두 추가
 *     description: 사용자가 새로운 투두 항목을 생성합니다. 반복 설정 및 카테고리 연결이 가능합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 스터디 하기
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-01T09:00:00.000Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-01T10:00:00.000Z
 *               repeat:
 *                 type: string
 *                 enum: [NONE, DAILY, WEEKLY, MONTHLY, YEARLY]
 *                 example: NONE
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["d1f9f97e-xxxx-yyyy-zzzz-abcabcabcabc"]
 *               isDone:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Add todo success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Add todo success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 4a34c5b3-xxxx-yyyy-zzzz-todotodotodo
 *                       title:
 *                         type: string
 *                         example: 스터디 하기
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-01T09:00:00.000Z
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-01T10:00:00.000Z
 *                       repeat:
 *                         type: string
 *                         example: NONE
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["d1f9f97e-xxxx-yyyy-zzzz-abcabcabcabc"]
 *                       isDone:
 *                         type: boolean
 *                         example: false
 */
router.post("/todo/addtodo", authenticate, addTodo);

/**
 * @swagger
 * /api/todo/updatecategory:
 *   patch:
 *     tags:
 *       - todo
 *     summary: 투두 수정
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               repeat:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               isDone:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 투두 수정 성공
 */
router.patch("/todo/updatecategory", authenticate, updateTodoCategory);

/**
 * @swagger
 * /api/todo/deletetodo:
 *   delete:
 *     tags:
 *       - todo
 *     summary: 투두 삭제
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: 투두 삭제 성공
 */
router.delete("/todo/deletetodo", authenticate, deleteTodo);

/**
 * @swagger
 * /api/todo/bringtodo:
 *   post:
 *     tags:
 *       - todo
 *     summary: 특정 날짜의 투두 불러오기
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: 해당 날짜의 투두 반환
 */
router.post("/todo/bringtodo", authenticate, bringTodo);

/**
 * @swagger
 * /api/todo/bringtodonum:
 *   get:
 *     tags:
 *       - todo
 *     summary: 해결한 투두 수 가져오기
 *     responses:
 *       200:
 *         description: 완료된 투두 수 반환
 */
router.get("/todo/bringtodonum", authenticate, bringTodoDoneCount);

/**
 * @swagger
 * /api/schedule/updatetodo:
 *   patch:
 *     tags:
 *       - todo
 *     summary: 투두 완료 상태 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               isDone:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 투두 업데이트 성공
 */
router.patch("/schedule/updatetodo", authenticate, updateTodoDone);

export default router;
