/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      path: "/api/socket",
    });

    socket.current.on("connect", () => {
      console.log("Connected to Server with ID:", socket.current.id);
    });

    socket.current.on("newGame", (gameId: string | number) => {
      console.log("New Game Has Been Created", gameId);
    });

    socket.current.on("joinGame", (gameId: string | number) => {
      console.log(`Game with Game ID: ${gameId} joined.`);
    });

    socket.current.on(
      "playerMove",
      ({
        gameId,
        index,
        playerSymbol,
      }: {
        gameId: string | number;
        index: number;
        playerSymbol: string;
      }) => {
        console.log(`Player ${playerSymbol} made a move in ${gameId} ${index}`);
      }
    );

    socket.current.on("connect_error", (err: any) => {
      console.error("Connection Error:", err);
      setTimeout(() => {
        socket.current.connect();
      }, 5000);
    });

    return () => {
      socket.current.disconnect();
      console.log("Disconnected from Server");
    };
  }, []);

  return socket;
};

export default useSocket;
