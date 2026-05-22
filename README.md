# WorldFantasy 2026 

Fantasy league del Mundial FIFA 2026 con predicciones ML y ligas privadas en tiempo real.

## Stack

- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express + Socket.io
- **Bases de datos**: PostgreSQL (usuarios/ligas) + MongoDB (stats jugadores)
- **ML Service**: Python + FastAPI + scikit-learn/XGBoost
- **Datos**: API-Football (api-football.com)

## Arrancar en desarrollo

### Backend
```bash
cd backend
cp .env.example .env   # completá las variables
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### ML Service
```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Roadmap

- [x] **Fase 1** — Auth, modelos DB, estructura base ✅
- [ ] **Fase 2** — Sistema fantasy: draft, ligas, puntos
- [ ] **Fase 3** — ML: predicciones por jugador y partido
- [ ] **Fase 4** — WebSockets: puntos en tiempo real

## API Docs

Con el backend corriendo: `http://localhost:3001/health`  
Con ML corriendo: `http://localhost:8000/docs` (Swagger auto-generado por FastAPI)
