import { Server, Socket } from 'socket.io';
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
    });
  }

  private getUserData(socket: Socket) {
    return {
      name: socket.data.user.name,
      username: socket.data.user.username,
      id: socket.data.user.id,
    } as UserData;
  }

  getIo() {
    return this.io;
  }
}
