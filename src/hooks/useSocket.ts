/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io();
    return () => socket.current.disconnect();
  }, []);

  return socket;
};

export default useSocket;
