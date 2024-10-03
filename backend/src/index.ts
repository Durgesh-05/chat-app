import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { SocketHandler } from './socket';

const app = express();
const port = process.env.PORT || 8000;
const server = createServer(app);

const socketHandler = new SocketHandler(server);
socketHandler.onConnect();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: `Server is Healthy and Listening at Port: ${port}` });
});

server.listen(port, () => {
  console.log(`Server is Listening at Port: ${port}`);
});

export { socketHandler };
