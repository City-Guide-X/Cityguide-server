require('dotenv').config();
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '@types';
import { log } from '@utils';
import { put } from 'memory-cache';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import { allowedOrigins } from './middlewares/corsCredentials';

declare global {
  var onlineUsers: Map<string, string>;
}

const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.DB_URI));
  } catch (err) {
    process.exit(1);
  }
};
connectDB();

const port = process.env.PORT;

global.onlineUsers = new Map<string, string>();
mongoose.connection.once('open', () => {
  const server = app.listen(port, () => log.info(`Server listening on port ${port}...`));
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });
  app.set('socketConn', io);
  io.on('connection', (socket) => {
    put('appSocket', socket);
    socket.on('add_user', async (userId) => {
      put('currentUser', userId);
      onlineUsers.set(userId, socket.id);
    });
    socket.on('disconnect', () => {
      onlineUsers.forEach((val, key) => {
        if (val === socket.id) onlineUsers.delete(key);
      });
    });
  });
});
