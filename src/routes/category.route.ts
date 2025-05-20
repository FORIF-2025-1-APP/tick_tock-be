import { Router } from "express";
import {
  createCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = Router();

router.post("/category", createCategory);
router.delete("/category/:categoryId", deleteCategory);

export default router;
