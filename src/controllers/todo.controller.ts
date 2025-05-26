import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { format } from "date-fns";

const prisma = new PrismaClient();

// 반복 날짜 생성 함수
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

// ✅ 투두 추가 API
export const addTodo = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.userId;
  const { title, startTime, endTime, repeat, categories, isDone } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const dates =
      repeat === "NONE" ? [start] : generateRepeatDates(start, end, repeat);
    const recurringEventId = repeat === "NONE" ? null : crypto.randomUUID();

    const createdTodos = await Promise.all(
      dates.map(async (date) => {
        const todo = await prisma.todo.create({
          data: {
            title,
            date,
            startTime: start,
            endTime: end,
            repeat,
            isDone,
            recurringEventId,
            userId,
            categories: {
              create: categories.map((categoryId: string) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          },
        });

        return {
          id: todo.id,
          title: todo.title,
          startTime: todo.startTime,
          endTime: todo.endTime,
          repeat: todo.repeat,
          categories,
          isDone: todo.isDone,
        };
      })
    );

    return res.status(201).json({
      ok: true,
      message: "Add todo success",
      data: createdTodos,
    });
  } catch (err) {
    console.error("addTodo error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//투두 수정
export const updateTodoCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;
  const { id, title, startTime, endTime, repeat, categories, isDone } =
    req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    // 해당 투두가 존재하는지 확인
    const existing = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // 기존 카테고리 연결 삭제
    await prisma.todoOnCategory.deleteMany({
      where: { todoId: id },
    });

    // 투두 업데이트 + 카테고리 재연결
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        repeat,
        isDone,
        categories: {
          create: categories.map((categoryId: string) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
    });

    return res.status(200).json({
      message: "Successfully Update Todo",
      data: {
        title: updatedTodo.title,
        startTime: updatedTodo.startTime,
        endTime: updatedTodo.endTime,
        repeat: updatedTodo.repeat,
        categories,
        isDone: updatedTodo.isDone,
      },
    });
  } catch (err) {
    console.error("updateTodoCategory error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//투두삭제
export const deleteTodo = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.userId;
  const { id } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // ✅ 먼저 관계 삭제
    await prisma.todoOnCategory.deleteMany({
      where: { todoId: id },
    });

    // todo삭제
    await prisma.todo.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Successfully Delete Todo" });
  } catch (err) {
    console.error("deleteTodo error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//특정날짜 todo 불러오기
export const bringTodo = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.userId;
  const { date } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ 해당 날짜 범위 내의 todo 조회 (userId도 필터 조건에 포함)
    const todos = await prisma.todo.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay, // 그 날의 시작 이상
          lte: endOfDay, // 그 날의 끝 이하
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const result = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      startTime: todo.startTime,
      endTime: todo.endTime,
      repeat: todo.repeat,
      categories: todo.categories.map((c) => c.category.title),
      isDone: todo.isDone,
    }));

    return res.status(200).json({
      ok: true,
      message: "Get todo success",
      data: result,
    });
  } catch (err) {
    console.error("bringTodo error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//완료한 투두 수 가져오기
export const bringTodoDoneCount = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const count = await prisma.todo.count({
      where: {
        userId,
        isDone: true,
      },
    });

    return res.status(200).json({
      sumOfisDone: count.toString(),
    });
  } catch (err) {
    console.error("bringTodoDoneCount error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//update todo 완료 일정 체크
export const updateTodoDone = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.userId;
  const { id, isDone } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!id || typeof isDone !== "boolean") {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    // 해당 투두가 유저의 것인지 확인
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await prisma.todo.update({
      where: { id },
      data: { isDone },
    });

    return res.status(200).json({
      ok: true,
      message: "Todo updated successfully",
    });
  } catch (err) {
    console.error("updateTodoDone error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// // POST /api/todo/addtodo
// export const addTodo = async (req: Request, res: Response): Promise<any> => {
//   const { id, title, startTime, endTime, repeat, categories, isDone } =
//     req.body;

//   return res.status(200).json({
//     ok: true,
//     message: "Add todo success",
//     data: [
//       {
//         id,
//         title,
//         startTime,
//         endTime,
//         repeat,
//         categories,
//         isDone,
//       },
//     ],
//   });
// };

// // PATCH /api/todo/updatecategory
// export const updateTodoCategory = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { id, title, startTime, endTime, repeat, categories, isDone } =
//     req.body;

//   return res.status(200).json({
//     message: "Successfully Update Todo",
//     data: [
//       {
//         title,
//         startTime,
//         endTime,
//         repeat,
//         categories,
//         isDone,
//       },
//     ],
//   });
// };

// // DELETE /api/todo/deletetodo
// export const deleteTodo = async (req: Request, res: Response): Promise<any> => {
//   const { id } = req.body;

//   return res.status(200).json({
//     message: "Successfully Delete Todo",
//   });
// };

// // GET /api/todo/bringtodo
// export const bringTodo = async (req: Request, res: Response): Promise<any> => {
//   const { date } = req.body;

//   return res.status(200).json({
//     ok: true,
//     message: "Get todo success",
//     data: [
//       {
//         id: "todo-123",
//         title: "운동하기",
//         startTime: `${date}T09:00:00Z`,
//         endTime: `${date}T10:00:00Z`,
//         repeat: "DAILY",
//         categories: ["헬스", "습관"],
//         isDone: false,
//       },
//     ],
//   });
// };

// // GET /api/todo/bringtodonum
// export const bringTodoDoneCount = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   return res.status(200).json({
//     sumOfisDone: "5",
//   });
// };
