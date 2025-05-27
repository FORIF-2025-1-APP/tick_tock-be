import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

// export const register1 = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { email, password, username } = req.body;

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) {
//     return res.status(400).json({ message: "이미 등록된 이메일입니다." });
//   }

//   const user = await prisma.user.create({
//     data: {
//       email,
//       password,
//       nickname: username,
//     },
//   });

//   const token = generateToken(user.id);

//   return res.json({
//     message: "User created successfully",
//     token,
//     user: {
//       id: user.id,
//       email: user.email,
//       nickname: user.nickname,
//     },
//   });
// };

//dummy
export const register = async (req: Request, res: Response): Promise<any> => {
  const { email, password, username } = req.body;

  return res.status(201).json({
    message: "User created successfully",
    token: "dummy.jwt.token.abc123",
    user: {
      id: "dummy-user-id-001",
      email,
      nickname: username,
    },
  });
};

//dummy
export const checkEmail = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  // 특정 이메일이면 중복 처리
  if (email === "existing@example.com") {
    return res.status(200).json({ message: "이미 등록된 이메일입니다." });
  }
  return res.status(200).json({ message: "사용 가능한 이메일입니다." });
};

// ✅ 로그인 (더미)
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  // 더미 조건: 이메일과 비밀번호가 정확히 이거면 로그인 성공
  if (email === "user@example.com" && password === "string") {
    return res.status(200).json({
      message: "Login successful",
      token: "dummy.jwt.token.123456",
      user: {
        id: "dummy-user-id",
        email: "user@example.com",
        nickname: "유저",
      },
    });
  }

  // 실패
  return res.status(401).json({
    message: "invalid credentials",
  });
};

// ✅ 구글 로그인 (더미)
export const googleLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { idToken } = req.body;

  // idToken이 아무 값이어도 성공 응답 (실제 구현에서는 토큰 검증 필요)
  if (!idToken) {
    return res.status(400).json({ message: "idToken is required" });
  }

  return res.status(200).json({
    message: "Google Login successful",
    token: "dummy.jwt.token.google123",
    user: {
      id: "google-user-id-001",
      email: "googleuser@example.com",
      nickname: "구글유저",
    },
  });
};

// ✅ 비밀번호 찾기 (더미)
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;

  // 더미 기준: 특정 이메일이면 성공
  if (email === "user@example.com") {
    return res.status(200).json({
      message: "임시 비밀번호가 이메일로 전송되었습니다.",
    });
  }

  // 실패: 등록되지 않은 이메일
  return res.status(404).json({
    message: "이메일에 해당하는 사용자가 없습니다.",
  });
};
