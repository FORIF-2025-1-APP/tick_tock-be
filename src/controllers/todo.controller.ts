import { Request, Response } from "express";

// POST /api/todo/addtodo
export const addTodo = async (req: Request, res: Response): Promise<any> => {
  const { id, title, startTime, endTime, repeat, categories, isDone } =
    req.body;

  return res.status(200).json({
    ok: true,
    message: "Add todo success",
    data: [
      {
        id,
        title,
        startTime,
        endTime,
        repeat,
        categories,
        isDone,
      },
    ],
  });
};

// PATCH /api/todo/updatecategory
export const updateTodoCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id, title, startTime, endTime, repeat, categories, isDone } =
    req.body;

  return res.status(200).json({
    message: "Successfully Update Todo",
    data: [
      {
        title,
        startTime,
        endTime,
        repeat,
        categories,
        isDone,
      },
    ],
  });
};

// DELETE /api/todo/deletetodo
export const deleteTodo = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.body;

  return res.status(200).json({
    message: "Successfully Delete Todo",
  });
};

// GET /api/todo/bringtodo
export const bringTodo = async (req: Request, res: Response): Promise<any> => {
  const { date } = req.body;

  return res.status(200).json({
    ok: true,
    message: "Get todo success",
    data: [
      {
        id: "todo-123",
        title: "운동하기",
        startTime: `${date}T09:00:00Z`,
        endTime: `${date}T10:00:00Z`,
        repeat: "DAILY",
        categories: ["헬스", "습관"],
        isDone: false,
      },
    ],
  });
};

// GET /api/todo/bringtodonum
export const bringTodoDoneCount = async (
  req: Request,
  res: Response
): Promise<any> => {
  return res.status(200).json({
    sumOfisDone: "5",
  });
};
