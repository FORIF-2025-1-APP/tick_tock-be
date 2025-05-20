// src/routes/calendar.route.ts
import { Router } from "express";
import {
  getCalendar,
  getCalendarById,
  bringTodoByDate,
  addSchedule,
  updateSchedule,
  updateTodoDone,
} from "../controllers/calendar.controller";

const router = Router();

/**
 * @swagger
 * /api/calendar:
 *   get:
 *     summary: 캘린더 전체 가져오기
 *     responses:
 *       200:
 *         description: 캘린더 리스트 반환
 */
router.get("/calendar", getCalendar);
/**
 * @swagger
 * /api/calendar/{id}/category:
 *   get:
 *     summary: 특정 캘린더 + 카테고리 정보 가져오기
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 캘린더 + 카테고리 정보 반환
 */
router.get("/calendar/:id/category", getCalendarById);
/**
 * @swagger
 * /api/todo/bringtodo:
 *   post:
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
router.post("/todo/bringtodo", bringTodoByDate);
/**
 * @swagger
 * /api/schedule/addschedule:
 *   post:
 *     summary: 일정 추가
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *     responses:
 *       200:
 *         description: 일정 추가 성공
 */
router.post("/schedule/addschedule", addSchedule);
/**
 * @swagger
 * /api/schedule/updateschedule:
 *   put:
 *     summary: 일정 수정
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
 *     responses:
 *       200:
 *         description: 일정 수정 성공
 */
router.put("/schedule/updateschedule", updateSchedule);
/**
 * @swagger
 * /api/schedule/updatetodo:
 *   patch:
 *     summary: 투두 완료 여부 수정
 *     requestBody:
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
router.patch("/schedule/updatetodo", updateTodoDone);

export default router;
