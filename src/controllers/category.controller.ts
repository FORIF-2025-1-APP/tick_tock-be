// src/controllers/category.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); //이건뭔지알아보기

//실제api
// 카테고리 생성
export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { title, color } = req.body;
  const userId = req.user?.userId;

  console.log("🔥 userId:", userId);
  console.log("📦 title:", title, "color:", color);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const category = await prisma.category.create({
      data: {
        title,
        color,
        userId,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    console.error("❌ DB error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//카테고리 삭제
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { categoryId } = req.params;
  const userId = req.user?.userId;

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.userId !== userId) {
      return res.status(404).json({ message: "Category not found" });
    }

    await prisma.category.delete({ where: { id: categoryId } });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//더미
// // 더미 카테고리 생성
// export const createCategory = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { title, color } = req.body;

//   return res.status(201).json({
//     message: "Category created successfully",
//     category: {
//       title,
//       color,
//     },
//   });
// };
// // 더미 카테고리 삭제
// export const deleteCategory = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { categoryId } = req.params;

//   return res.status(200).json({
//     message: "Category deleted successfully",
//   });
// };
