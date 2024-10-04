import { Server, Socket } from 'socket.io';
import { getChat } from '../controllers/chat.controller';
export interface UserData {
  username: string;
  name: string;
  id: string;
}

interface PrivateChats {
  userId1: string;
  userId2: string;
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

      const userData = this.getUserData(socket);
      socket.emit('me', userData);

      socket.on('join_room', async ({ userId1, userId2 }: PrivateChats) => {
        const roomId = await this.joinPrivateChat(socket, userId1, userId2);
        socket.emit('roomId', { roomId });
      });

      socket.on(
        'send_message',
        ({ message, roomId }: { message: string; roomId: string }) => {
          console.log(
            'Message Recieved from Room ',
            roomId + ' ' + 'message ',
            message
          );

          this.io.to(roomId).emit('message', { message: message });
        }
      );
    });
  }

  private getUserData(socket: Socket) {
    return {
      name: socket.data.user.name,
      username: socket.data.user.username,
      id: socket.data.user.id,
    } as UserData;
  }

  private async joinPrivateChat(
    socket: Socket,
    user1Id: string,
    user2Id: string
  ) {
    let roomId: string = await getChat(user1Id, user2Id);
    socket.join(roomId);
    return roomId;
  }

  getIo() {
    return this.io;
  }
}
