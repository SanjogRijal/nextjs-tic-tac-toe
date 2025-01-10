/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";

export default function handler(_: any, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    const gameRooms: any = {};
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("newGame", () => {
        socket.join(socket.id);
        gameRooms[socket.id] = [socket.id];
        socket.broadcast.emit("Game Created Successfully: ", {
          gameId: socket.id,
        });
        console.log(`New game with game id: ${socket.id} created`);
      });

      socket.on("playerMove", (data) => {
        const { gameId } = data;
        if (gameRooms[gameId]) {
          io.to(gameId).emit("playerMove", data);
        } else {
          socket.emit("error", "Game id is not valid. Please try again.");
        }
      });

      socket.on("joinGame", (gameId: any) => {
        if (gameRooms[gameId]) {
          if (gameRooms[gameId].length < 2) {
            socket.join(gameId);
            gameRooms[gameId].push(socket.id);
            socket.emit("You have joined the game", { userId: socket.id });
          } else {
            socket.emit(
              "error",
              "This game room is already maxed out. Please create another."
            );
          }
        } else {
          socket.emit("error", "Game ID is not valid. Please try again.");
        }
      });

      socket.on("reset", (gameId) => {
        if (gameRooms[gameId]) {
          io.to(gameId).emit("reset");
          console.log(`Game with ID: ${gameId} has been reset`);
        } else {
          socket.emit("error", "Game number is not valid. Please try again");
        }
      });

      socket.on("disconnect", () => {
        console.log("A user has disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket IO Already Initialized");
  }
  res.end();
}
