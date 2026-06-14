export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join_league', (leagueId) => {
      socket.join(`league:${leagueId}`);
      console.log(`Socket ${socket.id} joined league:${leagueId}`);
    });

    socket.on('leave_league', (leagueId) => {
      socket.leave(`league:${leagueId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

// Helper para emitir actualizacion de puntos a todas las ligas
export const emitPointsUpdate = (io, leagueId, data) => {
  io.to(`league:${leagueId}`).emit('points_update', data);
};

// Helper para emitir que un partido terminó
export const emitMatchFinished = (io, matchId, results) => {
  io.emit('match_finished', { matchId, results });
};