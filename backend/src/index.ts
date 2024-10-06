import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { SocketHandler } from './socket/SocketHandler';
import userRouter from './routes/user.route';
import chatRouter from './routes/chat.route';
import { Socket } from 'socket.io';

// Init
const app = express();
const port = process.env.PORT || 8000;
const server = createServer(app);

const socketHandler = new SocketHandler(server);
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
app.use('/api/v1/chat', chatRouter);
// io.use((socket: Socket, next) => {
//   const { token } = socket.handshake.auth;
//   console.log(token);
//   if (token) {
//     try {
//       const payload = jwt.verify(token, String(process.env.JWT_SECRET));
//       socket.data.user = payload;
//       next();
//     } catch (e) {
//       console.error('Authentication error:', e);
//       next(new Error('Authentication error: Invalid token'));
//     }
//   }
// });

// Server Check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: `Server is Healthy and Listening at Port: ${port}` });
});

server.listen(port, () => {
  console.log(`Server is Listening at Port: ${port}`);
});

export { socketHandler };
