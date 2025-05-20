import { Router } from "express";
import {
  addTodo,
  updateTodoCategory,
  deleteTodo,
  bringTodo,
  bringTodoDoneCount,
} from "../controllers/todo.controller";

const router = Router();

router.post("/todo/addtodo", addTodo);
router.patch("/todo/updatecategory", updateTodoCategory);
router.delete("/todo/deletetodo", deleteTodo);
router.post("/todo/bringtodo", bringTodo);
router.get("/todo/bringtodonum", bringTodoDoneCount);

export default router;
