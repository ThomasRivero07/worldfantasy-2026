export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ Socket connected:', socket.id);

    socket.on('join_league', (leagueId) => {
      socket.join(`league:${leagueId}`);
      console.log(`Socket ${socket.id} joined league:${leagueId}`);
    });

    // En fase 4: emitir puntos en vivo
    // io.to(`league:${leagueId}`).emit('points_update', { teamId, points, breakdown })

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
