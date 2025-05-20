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

router.get("/calendar", getCalendar);
router.get("/calendar/:id/category", getCalendarById);
router.post("/todo/bringtodo", bringTodoByDate);
router.post("/schedule/addschedule", addSchedule);
router.put("/schedule/updateschedule", updateSchedule);
router.patch("/schedule/updatetodo", updateTodoDone);

export default router;
