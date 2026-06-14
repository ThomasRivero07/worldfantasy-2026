import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socketInstance;
};

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = getSocket();
    return () => {};
  }, []);

  const joinLeague = useCallback((leagueId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_league', leagueId);
    }
  }, []);

  const leaveLeague = useCallback((leagueId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_league', leagueId);
    }
  }, []);

  const onPointsUpdate = useCallback((callback) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on('points_update', callback);
    return () => socket.off('points_update', callback);
  }, []);

  const onMatchFinished = useCallback((callback) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on('match_finished', callback);
    return () => socket.off('match_finished', callback);
  }, []);

  return { joinLeague, leaveLeague, onPointsUpdate, onMatchFinished };
};
