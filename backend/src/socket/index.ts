import { Server, Socket } from 'socket.io';

export class SocketHandler {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        credentials: true,
      },
    });
  }

  onConnect() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User  connected to Websocket Server ', socket.id);
      socket.on('disconnect', () => {
        console.log('User  disconnected from Websocket Server ', socket.id);
      });

      socket.on('message', ({ message }: { message: string }) => {
        console.log('Message from ', socket.id + ' ' + message);
        this.io.emit('recieved-message', { message: 'Message is Recieved' });
      });
    });
  }

  getIo() {
    return this.io;
  }
}
