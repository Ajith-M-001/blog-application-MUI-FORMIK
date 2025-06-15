// services/socket/socketService.js
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "../../utils/verifyToken.js";
import dotenv from "dotenv";
dotenv.config();

class SocketService {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // Map<userId, socketId>
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_DEV_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.use(async (socket, next) => {
      cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next)
      );
    });

    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      this.userSockets.set(socket.user._id, socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        this.userSockets.delete(socket.user._id);
      });
    });

    return this;
  }

  // Get Socket.IO instance for testing or other purposes
  getIO() {
    return this.io;
  }
}

const socketService = new SocketService();
export default socketService;
