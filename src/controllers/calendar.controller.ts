// src/controllers/calendar.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto"; // 반복 일정 ID 생성에 사용
import { format } from "date-fns";

const prisma = new PrismaClient();

// 컨트롤러 내부에 반복 날짜 생성 함수 선언
const generateRepeatDates = (
  startDate: Date,
  endDate: Date,
  repeat: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
): Date[] => {
  const result: Date[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    result.push(new Date(current));

    switch (repeat) {
      case "DAILY":
        current.setDate(current.getDate() + 1);
        break;
      case "WEEKLY":
        current.setDate(current.getDate() + 7);
        break;
      case "MONTHLY":
        current.setMonth(current.getMonth() + 1);
        break;
      case "YEARLY":
        current.setFullYear(current.getFullYear() + 1);
        break;
      default:
        break;
    }
  }

  return result;
};

// 일정 생성 (반복여부까지)
export const addSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;
  const { title, startTime, endTime, repeat, categories } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const dates =
      repeat === "NONE" ? [start] : generateRepeatDates(start, end, repeat);

    const recurringEventId = repeat === "NONE" ? null : crypto.randomUUID(); // 반복 일정의 원본 ID

    const createdSchedules = await Promise.all(
      dates.map(async (date) => {
        return await prisma.calendar.create({
          data: {
            title,
            date,
            startTime: start,
            endTime: end,
            repeat,
            recurringEventId,
            userId,
            categories: {
              create: categories.map((categoryId: string) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          },
        });
      })
    );

    return res.status(201).json({
      ok: true,
      message: "Add todo success",
      data: createdSchedules.map((item) => ({
        id: item.id,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        repeat: item.repeat,
        date: item.date,
        categories,
      })),
    });
  } catch (err) {
    console.error("addSchedule error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//일정 수정
export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;
  const { id, title, startTime, endTime, repeat, categories } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    // 기존 일정이 유저 소유인지 확인
    const existing = await prisma.calendar.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // 기존 카테고리 연결 삭제
    await prisma.calendar.update({
      where: { id },
      data: {
        categories: {
          deleteMany: {},
        },
      },
    });

    // 일정 업데이트 + 새 카테고리 연결
    const updated = await prisma.calendar.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        repeat,
        categories: {
          create: categories.map((categoryId: string) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Update todo success",
      data: {
        id: updated.id,
        title: updated.title,
        startTime: updated.startTime,
        endTime: updated.endTime,
        repeat: updated.repeat,
        categories,
      },
    });
  } catch (err) {
    console.error("updateSchedule error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//전체 캘린더 가져오기
// 일정 있는 날짜 목록 가져오기
export const getCalendar = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const calendars = await prisma.calendar.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        startTime: true,
      },
    });

    const data = calendars.map((item) => ({
      id: item.id,
      title: item.title,
      date: format(new Date(item.startTime), "yyyy-MM-dd"),
      hasSchedule: true,
    }));

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    console.error("getCalendar error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//특정 Calendar의 카테고리 및 캘린더 조회
//캘린더 아이디로 연관 정보 싹 긁어옴
export const getCalendarById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const calendar = await prisma.calendar.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true, // 실제 카테고리 정보
          },
        },
      },
    });

    if (!calendar || calendar.userId !== userId) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    return res.status(200).json({
      calendar: [
        {
          id: calendar.id,
          title: calendar.title,
          startTime: calendar.startTime,
          endTime: calendar.endTime,
          repeat: calendar.repeat,
          categories: calendar.categories.map((c) => ({
            id: c.category.id,
            name: c.category.title,
          })),
        },
      ],
    });
  } catch (err) {
    console.error("getCalendarById error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//일정 삭제
export const deleteSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;
  const { id } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 해당 일정이 본인의 일정인지 확인
    const schedule = await prisma.calendar.findUnique({
      where: { id },
    });

    if (!schedule || schedule.userId !== userId) {
      return res.status(404).json({ ok: false, message: "Schedule not found" });
    }

    // 삭제 실행
    await prisma.calendar.delete({
      where: { id },
    });

    return res.status(200).json({
      ok: true,
      message: "Schedule deleted successfully",
    });
  } catch (err) {
    console.error("deleteSchedule error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// // 캘린더 가져오기
// export const getCalendar = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   return res.json({
//     ok: true,
//     data: [
//       {
//         id: "calendar-001",
//         title: "시험 기간",
//         date: "2025-06-01",
//         hasSchedule: true,
//       },
//       {
//         id: "calendar-002",
//         title: "운동 루틴",
//         date: "2025-06-02",
//         hasSchedule: false,
//       },
//     ],
//   });
// };

// // 특정 캘린더 + 카테고리 조회
// export const getCalendarById = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { id } = req.params;

//   return res.json({
//     calendar: [
//       {
//         id,
//         title: "시험 기간",
//         startTime: "2025-06-01T09:00:00Z",
//         endTime: "2025-06-01T11:00:00Z",
//         repeat: "NONE",
//         category: {
//           id: "cat-001",
//           name: "학교",
//         },
//       },
//     ],
//   });
// };

// // 특정 날짜 투두 불러오기
// export const bringTodoByDate = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { date } = req.body;

//   return res.json({
//     ok: true,
//     message: "Get todo success",
//     data: [
//       {
//         id: "todo-001",
//         title: "수학 과제",
//         startTime: `${date}T10:00:00Z`,
//         endTime: `${date}T11:00:00Z`,
//         repeat: "NONE",
//         categories: ["공부", "과제"],
//         isDone: false,
//       },
//     ],
//   });
// };

// // 일정 추가
// export const addSchedule = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { title, startTime, endTime, repeat, categories } = req.body;

//   return res.json({
//     ok: true,
//     message: "Add todo success",
//     data: [
//       {
//         id: "todo-002",
//         title,
//         startTime,
//         endTime,
//         repeat,
//         categories,
//       },
//     ],
//   });
// };

// // 일정 수정
// export const updateSchedule = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { id, title, startTime, endTime, repeat, categories } = req.body;

//   return res.json({
//     ok: true,
//     message: "Update todo success",
//     data: {
//       id,
//       title,
//       startTime,
//       endTime,
//       repeat,
//       categories,
//     },
//   });
// };

// // 투두 완료 상태 수정
// export const updateTodoDone = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { id, isDone } = req.body;

//   return res.json({
//     ok: true,
//     message: "Todo updated successfully",
//   });
// };
