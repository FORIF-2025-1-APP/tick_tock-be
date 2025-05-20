// src/controllers/friend.controller.ts
import { Request, Response } from "express";

// 친구 추가
export const addFriend = async (req: Request, res: Response): Promise<any> => {
  const { friendnickname } = req.body;

  return res.status(200).json({
    message: "Friend request sent successfully",
  });
};

// 친구 삭제
export const deleteFriend = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { friendnickname } = req.body;
  const { friendId } = req.params;

  return res.status(200).json({
    message: "Friend removed successfully",
  });
};

// 친구 목록 조회
export const getFriends = async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json([
    {
      id: "user-001",
      friendId: "friend-001",
      friendnickname: "홍길동",
    },
    {
      id: "user-001",
      friendId: "friend-002",
      friendnickname: "김민지",
    },
  ]);
};

// 친구 일정 조회
export const getFriendSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  return res.status(200).json([
    {
      friendId: "friend-001",
      friendnickname: "홍길동",
      schedules: [
        {
          id: "sched-01",
          title: "함께 운동하기",
          startTime: "2025-06-03T10:00:00Z",
          endTime: "2025-06-03T11:00:00Z",
        },
      ],
    },
  ]);
};
