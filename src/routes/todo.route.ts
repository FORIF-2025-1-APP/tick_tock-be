import { Router } from "express";
import {
  addTodo,
  updateTodoCategory,
  deleteTodo,
  bringTodo,
  bringTodoDoneCount,
} from "../controllers/todo.controller";

const router = Router();

/**
 * @swagger
 * /api/todo/addtodo:
 *   post:
 *          tags:
 *        - todo
 *
 *     summary: 투두 추가
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
 *         description: 투두 추가 성공
 */
router.post("/todo/addtodo", addTodo);
/**
 * @swagger
 * /api/todo/updatecategory:
 *   patch:
 *          tags:
 *        - todo
 *
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
router.patch("/todo/updatecategory", updateTodoCategory);
/**
 * @swagger
 * /api/todo/deletetodo:
 *   delete:
 *          tags:
 *        - todo
 *
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

router.delete("/todo/deletetodo", deleteTodo);
/**
 * @swagger
 * /api/todo/bringtodo:
 *   post:
 *          tags:
 *        - todo
 *
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

router.post("/todo/bringtodo", bringTodo);
/**
 * @swagger
 * /api/todo/bringtodonum:
 *   get:
 *          tags:
 *        - todo
 *
 *     summary: 해결한 투두 수 가져오기
 *     responses:
 *       200:
 *         description: 완료된 투두 수 반환
 */
router.get("/todo/bringtodonum", bringTodoDoneCount);

export default router;
