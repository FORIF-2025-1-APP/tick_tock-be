// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Profile get error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfileImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { image } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { image: image || user.image },
    });

    return res.status(200).json({
      message: "Profile image updated successfully",
      profileImageUrl: image || "",
    });
  } catch (error) {
    console.error("Profile image update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PATCH 비밀번호 변경
export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PATCH 닉네임 변경
export const updateNickname = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { nickname } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { nickname },
    });

    return res.status(200).json({
      message: "Nickname updated successfully",
      user: {
        id: user.id,
        email: user.email,
        nickname,
      },
    });
  } catch (error) {
    console.error("Nickname update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE 회원 탈퇴
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(200).json({
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("User deletion error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
