import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes     from './routes/auth.routes.js';
import playerRoutes   from './routes/player.routes.js';
import leagueRoutes   from './routes/league.routes.js';
import teamRoutes     from './routes/team.routes.js';
import matchRoutes    from './routes/match.routes.js';
import statsRoutes    from './routes/stats.routes.js';
import transferRoutes from './routes/transfer.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { connectPostgres } from './config/db.js';
import { initSocket } from './sockets/index.js';

// Importar modelos para que Sequelize los registre
import './models/User.model.js';
import './models/League.model.js';
import './models/FantasyTeam.model.js';
import './models/PointsLog.model.js';
import './models/Player.model.js';
import './models/Match.model.js';
import './models/PlayerStats.model.js';
import './models/Transfer.model.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use('/api/auth',      authRoutes);
app.use('/api/players',   playerRoutes);
app.use('/api/leagues',   leagueRoutes);
app.use('/api/teams',     teamRoutes);
app.use('/api/matches',   matchRoutes);
app.use('/api/stats',     statsRoutes);
app.use('/api/transfers', transferRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', project: 'WorldFantasy 2026' }));

initSocket(io);
app.use(errorHandler);

connectPostgres().then(() => {
  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => console.log(` Server on ${PORT}`));
}).catch(err => console.error('', err.message));