import { prisma } from '../db';

export const getChat = async (user1Id: string, user2Id: string) => {
  const chat = await prisma.chat.findFirst({
    where: {
      participants: {
        some: {
          AND: [{ id: user1Id }, { id: user2Id }],
        },
      },
    },
  });

  if (chat) {
    return chat.id;
  }

  const newChat = await prisma.chat.create({
    data: {
      participants: {
        connect: [{ id: user1Id }, { id: user2Id }],
      },
    },
  });

  return newChat.id;
};
