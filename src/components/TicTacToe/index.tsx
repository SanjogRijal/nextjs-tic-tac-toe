/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useSocket from "../../hooks/useSocket";
import { useEffect, useState } from "react";

export default function TicTacToe() {
  // const socket = useSocket();
  const [currentGame, setCurrentGame] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<string>("");
  const [symbol, setSymbol] = useState("x");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);
  const socket = useSocket();

  const createGame = () => {
    setSymbol("x");
    socket.current.emit("newGame");
  };

  const joinGame = () => {
    setSymbol("o");
    socket.current.emit("joinGame");
  };
  const handleMove = (index: number) => {
    if (!gameStarted) {
      setGameStatus("Wait for the opponent to join");
      return;
    }

    if (!currentGame) {
      setGameStatus("You need to first create or join game");
      return;
    }
    if (board[index]) return;
    if (!isMyTurn && symbol === "x") {
    }
    if (isMyTurn && symbol != "x") {
      setGameStatus("Please wait for opponent to make a move!");
      return;
    }
    const gameSymbol = isMyTurn ? "x" : "0";
    socket.current.emit("playerMove", {
      gameId: currentGame,
      index,
      gameSymbol,
    });
  };

  useEffect(() => {
    socket.current.on("newGame", ({ gameId }: { gameId: string | number }) => {
      setCurrentGame(gameId as string);
      setGameStatus(`Created. Game ID: ${gameId}`);
      console.log("New Game Created");
    });

    socket.current.on("joinGame", ({ gameId }: { gameId: string | number }) => {
      setCurrentGame(gameId as string);
      setGameStatus(`YOU JOINED GAME: ${gameId}`);
    });

    socket.current.on("anotherUserJoined", ({ userId }: { userId: string }) => {
      setGameStatus(`User with user id: ${userId} has also joined the game.`);
      setGameStarted(true);
    });

    socket.current.on("playerMove", ({ gameId, index, playerSymbol }: any) => {
      const boardUpdated = [...board];
      boardUpdated[index] = playerSymbol;
      setBoard(boardUpdated);
      setIsMyTurn(playerSymbol !== "x");
      console.log(`Player made a move in ${gameId}`);
    });

    socket.current.on("reset", () => {
      console.log("Game reset");
      resetGame();
    });

    return () => {
      socket.current.off("newGame");
      socket.current.off("anotherUserJoined");
      socket.current.off("reset");
      socket.current.off("playerMove");
    };
  }, [board]);

  const resetGame = (iseUserInitialzed = true) => {
    setBoard(Array(9).fill(null));
    setIsMyTurn(true);
    if (iseUserInitialzed) {
      socket.current.emit("reset", currentGame);
    }
  };

  return (
    <>
      Ongoing Game: {currentGame}
      <button onClick={() => createGame()}>Start Game</button>
      <p>Your GameId is: {currentGame}</p>
      <button onClick={resetGame as any}>Reset Game</button>
      <h3>Game Status: {gameStatus}</h3>
      <p>Enter gameid to join: </p>
      <input type="text" />
      <button
        onClick={() => {
          joinGame();
        }}
      >
        JOIN
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gridTemplateRows: "repeat(3, 100px)",
          gap: "10px",
        }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleMove(idx)}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {cell || ""}
          </button>
        ))}
      </div>
    </>
  );
}
