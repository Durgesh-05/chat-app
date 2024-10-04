import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { SocketHandler } from './socket/SocketHandler';
import userRouter from './routes/user.route';
import { Socket } from 'socket.io';

// Init
const app = express();
const port = process.env.PORT || 8000;
const server = createServer(app);

const socketHandler = new SocketHandler(server);
socketHandler.onConnect();
const io = socketHandler.getIo();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/user', userRouter);
io.use((socket: Socket, next) => {
  const token = socket.handshake.auth;
  console.log(token);
  next();
});

// Server Check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: `Server is Healthy and Listening at Port: ${port}` });
});

server.listen(port, () => {
  console.log(`Server is Listening at Port: ${port}`);
});

export { socketHandler };
