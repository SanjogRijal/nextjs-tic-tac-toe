/* eslint-disable @typescript-eslint/no-explicit-any */
import useSocket from "../../hooks/useSocket";
import { useEffect, useState } from "react";

export default function TicTacToe() {
  const socket = useSocket();
  const [board, setBoard] = useState<Array<any>>(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);

  const handleMove = (index: number) => {
    if (board[index] || !isMyTurn) return;
    const boardUpdated = [...board];
    boardUpdated[index] = "x";
    setBoard(boardUpdated);
    setIsMyTurn(false);

    /**@emits: playerMove */
    socket.current.emit("playerMove", { index, value: "x" });
  };

  useEffect(() => {
    socket.current.on("updateBoard", ({ index, value }: any) => {
      const boardUpdated = [...board];
      boardUpdated[index] = value;
      setBoard(boardUpdated);
      setIsMyTurn(true);
    });
  }, [board, socket]);

  return (
    <div>
      {board.map((cell, idx) => (
        <button key={idx} onClick={() => handleMove(idx)}>
          {cell || "-"}
        </button>
      ))}
    </div>
  );
}
