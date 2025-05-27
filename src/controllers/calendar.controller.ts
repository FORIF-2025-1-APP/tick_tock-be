// src/controllers/calendar.controller.ts
import { Request, Response } from "express";

// ✅ 캘린더 가져오기
export const getCalendar = async (
  req: Request,
  res: Response
): Promise<any> => {
  return res.json({
    ok: true,
    data: [
      {
        id: "calendar-001",
        title: "시험 기간",
        date: "2025-06-01",
        hasSchedule: true,
      },
      {
        id: "calendar-002",
        title: "운동 루틴",
        date: "2025-06-02",
        hasSchedule: false,
      },
    ],
  });
};

// ✅ 특정 캘린더 + 카테고리 조회
export const getCalendarById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  return res.json({
    calendar: [
      {
        id,
        title: "시험 기간",
        startTime: "2025-06-01T09:00:00Z",
        endTime: "2025-06-01T11:00:00Z",
        repeat: "NONE",
        category: {
          id: "cat-001",
          name: "학교",
        },
      },
    ],
  });
};

// ✅ 특정 날짜 투두 불러오기
export const bringTodoByDate = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { date } = req.body;

  return res.json({
    ok: true,
    message: "Get todo success",
    data: [
      {
        id: "todo-001",
        title: "수학 과제",
        startTime: `${date}T10:00:00Z`,
        endTime: `${date}T11:00:00Z`,
        repeat: "NONE",
        categories: ["공부", "과제"],
        isDone: false,
      },
    ],
  });
};

// ✅ 일정 추가
export const addSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, startTime, endTime, repeat, categories } = req.body;

  return res.json({
    ok: true,
    message: "Add todo success",
    data: [
      {
        id: "todo-002",
        title,
        startTime,
        endTime,
        repeat,
        categories,
      },
    ],
  });
};

// ✅ 일정 수정
export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id, title, startTime, endTime, repeat, categories } = req.body;

  return res.json({
    ok: true,
    message: "Update todo success",
    data: {
      id,
      title,
      startTime,
      endTime,
      repeat,
      categories,
    },
  });
};

// ✅ 투두 완료 상태 수정
export const updateTodoDone = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id, isDone } = req.body;

  return res.json({
    ok: true,
    message: "Todo updated successfully",
  });
};
