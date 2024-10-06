import { Server, Socket } from 'socket.io';
import { prisma } from '../db';

interface PrivateChats {
  senderId: string;
  recipientId: string;
}

interface RoomMessage {
  roomId: string;
  senderId: string;
  recipientId: string;
  message: string;
}

export class SocketHandler {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        credentials: true,
      },
    });

    this.onConnect();
  }

  public onConnect() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User  connected to Websocket Server ', socket.id);
      socket.on('disconnect', () => {
        console.log('User  disconnected from Websocket Server ', socket.id);
      });

      socket.on('join room', async ({ roomId }: { roomId: string }) => {
        const isRoomValid = await this.getPrivateChat(roomId);
        if (isRoomValid) {
          console.log('RoomID ', roomId);
          socket.join(roomId);
        }
      });

      socket.on(
        'send message',
        ({ senderId, recipientId, roomId, message }: RoomMessage) => {
          console.log(
            'Message from senderId: ',
            senderId,
            ' to recipientId: ',
            recipientId,
            ' from room ',
            roomId
          );

          socket.broadcast
            .to(roomId)
            .emit('message', { message: message, senderId: senderId });
        }
      );
    });
  }

  getIo() {
    return this.io;
  }

  private async getPrivateChat(roomId: string) {
    const privateChat = await prisma.chat.findFirst({
      where: {
        id: roomId,
      },
    });
    if (privateChat) {
      return true;
    }

    return false;
  }
}
