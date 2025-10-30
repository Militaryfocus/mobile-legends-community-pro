"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const socketService_1 = require("./services/socketService");
const routes_1 = __importDefault(require("./routes")); // Импортируем главный router
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
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
app.use((0, cors_1.default)({
    origin: [
        'https://militaryfocus.ru',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(requestLogger_1.requestLogger);
// Routes
app.use('/api', routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log(`📋 Loaded routes:`);
    console.log('- /api/auth');
    console.log('- /api/heroes');
    console.log('- /api/builds');
    console.log('- /api/stats');
    console.log('- /api/calculator');
});
(0, socketService_1.setupSocket)(io);
//# sourceMappingURL=server.js.map