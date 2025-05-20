// src/controllers/category.controller.ts
import { Request, Response } from "express";

// 카테고리 생성
export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, color } = req.body;

  return res.status(201).json({
    message: "Category created successfully",
    category: {
      title,
      color,
    },
  });
};

// 카테고리 삭제
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { categoryId } = req.params;

  return res.status(200).json({
    message: "Category deleted successfully",
  });
};
