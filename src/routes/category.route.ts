import { Router } from "express";
import {
  createCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = Router();

/**
 * @swagger
 * /api/category:
 *   post:
 *         tags:
 *        - calendar
 *     summary: 카테고리 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "공부"
 *               color:
 *                 type: string
 *                 example: "#FFCC00"
 *     responses:
 *       201:
 *         description: 카테고리 생성 성공
 */
router.post("/category", createCategory);
/**
 * @swagger
 * /api/category/{categoryId}:
 *   delete:
 *        tags:
 *        - calendar
 *     summary: 카테고리 삭제
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 카테고리 삭제 성공
 */
router.delete("/category/:categoryId", deleteCategory);

export default router;
