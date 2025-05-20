// src/controllers/user.controller.ts
import { Request, Response } from "express";

export const updateProfileImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { image } = req.body;

  return res.status(200).json({
    message: "Profile image updated successfully",
    profileImageUrl: image || "https://dummyimage.com/profile.jpg",
  });
};

// PATCH 비밀번호 변경
export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (currentPassword !== "correctpass") {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  return res.status(200).json({
    message: "Password updated successfully",
  });
};

// PATCH 닉네임 변경
export const updateNickname = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { nickname } = req.body;

  return res.status(200).json({
    message: "Nickname updated successfully",
    user: {
      id: "user-id-001",
      email: "test@example.com",
      nickname,
    },
  });
};

// DELETE 회원 탈퇴
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json({
    message: "User account deleted successfully",
  });
};
