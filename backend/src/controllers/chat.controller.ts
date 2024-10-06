import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db';
import { ApiResponse } from '../utils/apiResponse';

export const fetchChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id1, id2 } = req.params;

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { id: id1 },
        },
      },
      include: {
        messages: true,
        participants: true,
      },
    });

    const chatWithId2 = findChatWithId2(chats, id2);

    if (chatWithId2) {
      res
        .status(200)
        .json(new ApiResponse(chatWithId2, 'Chats Fetched Successfully', 200));
      return;
    }

    const newChat = await createNewChat(id1, id2);
    res
      .status(201)
      .json(new ApiResponse(newChat, 'Chat Created Successfully', 201));
  } catch (error) {
    console.error('Failed to fetch or create chat:', error);
    res.status(500).json(new ApiResponse(null, 'Something Went Wrong', 500));
    next(error);
  }
};

const findChatWithId2 = (chats: any[], id2: string) => {
  return chats.find((chat) =>
    chat.participants.some((participant: any) => {
      return participant.id === id2;
    })
  );
};

const createNewChat = async (id1: string, id2: string) => {
  return await prisma.chat.create({
    data: {
      name: null,
      isGroup: false,
      participants: {
        connect: [{ id: id1 }, { id: id2 }],
      },
    },
    include: {
      messages: true,
      participants: true,
    },
  });
};
