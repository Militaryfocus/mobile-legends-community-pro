import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server as SocketServer } from 'socket.io';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { setupSocket } from './services/socketService';
import router from './routes'; // Импортируем главный router

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: [
      'https://militaryfocus.ru',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    'https://militaryfocus.ru',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173', 
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use('/api', router);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`📋 Loaded routes:`);
  console.log('- /api/auth');
  console.log('- /api/heroes'); 
  console.log('- /api/builds');
  console.log('- /api/stats');
  console.log('- /api/calculator');
});

setupSocket(io);
