/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";

export default function handler(_: any, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("playerMove", (data) => {
        socket.broadcast.emit("updateBoard", data);
      });

      socket.on("disconnect", () => {
        console.log("A user has disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
