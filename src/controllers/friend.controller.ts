// src/controllers/friend.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 친구 추가
export const addFriend = async (req: Request, res: Response): Promise<any> => {
  const { friendnickname } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await prisma.user.findFirst({
      where: { nickname: friendnickname },
    });

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId: user.id,
        addresseeId: friend.id,
        status: "PENDING",
      },
    });

    return res.status(200).json({
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.error("Friend add error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 친구 삭제
export const deleteFriend = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { friendnickname } = req.body;
  const { friendId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await prisma.user.findFirst({
      where: { id: friendId },
    });

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: user.id, addresseeId: friend.id },
          { requesterId: friend.id, addresseeId: user.id },
        ],
      },
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return res.status(200).json({
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("Friend delete error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 친구 목록 조회
export const getFriends = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: user.id }, { addresseeId: user.id }],
      },
      include: {
        requester: true,
        addressee: true,
      },
    });

    const friendList = friends.map((friend) => {
      return {
        id: friend.id,
        friendId:
          friend.requester.id === user.id
            ? friend.addressee.id
            : friend.requester.id,
        friendnickname:
          friend.requester.id === user.id
            ? friend.addressee.nickname
            : friend.requester.nickname,
        friendimage:
          friend.requester.id === user.id
            ? friend.addressee.image
            : friend.requester.image,
      };
    });

    return res.status(200).json(friendList);
  } catch (error) {
    console.error("Friend list get error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 친구 일정 조회
export const getFriendSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { friendId } = req.query as { friendId: string };

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    const schedules = await prisma.calendar.findMany({
      where: {
        userId: friend.id,
      },
    });

    return res.status(200).json({
      friendId: friend.id,
      friendnickname: friend.nickname,
      schedules,
    });
  } catch (error) {
    console.error("Friend schedule get error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
