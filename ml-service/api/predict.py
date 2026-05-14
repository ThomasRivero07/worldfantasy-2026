from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()

class PlayerFeatures(BaseModel):
    goals_last_5: float = 0
    assists_last_5: float = 0
    minutes_played: float = 0
    rating_avg: float = 6.0
    is_starter: bool = True
    opponent_strength: float = 5.0  # 1-10

class MatchFeatures(BaseModel):
    team_a_ranking: int
    team_b_ranking: int
    team_a_goals_avg: float
    team_b_goals_avg: float
    is_knockout: bool = False

@router.post("/predict/player")
def predict_player_score(features: PlayerFeatures):
    """
    Modelo simple basado en reglas para la Fase 1.
    En Fase 3 se reemplaza con XGBoost entrenado con datos históricos de Mundiales.
    """
    score = 0
    score += features.goals_last_5 * 6       # goles tienen alto peso
    score += features.assists_last_5 * 3      # asistencias
    score += (features.rating_avg - 6) * 2   # bonus por buen rating
    score += 2 if features.is_starter else 1
    score -= (features.opponent_strength - 5) * 0.5  # penaliza rivales fuertes
    score = max(0, min(score, 25))            # clamp 0-25 pts esperados

    confidence = 0.65 if features.minutes_played > 200 else 0.45

    return {
        "predicted_points": round(score, 1),
        "confidence": confidence,
        "breakdown": {
            "form_score": round(features.goals_last_5 * 6 + features.assists_last_5 * 3, 1),
            "rating_bonus": round((features.rating_avg - 6) * 2, 1),
            "difficulty_penalty": round((features.opponent_strength - 5) * 0.5, 1),
        }
    }

@router.post("/predict/match")
def predict_match(features: MatchFeatures):
    """Predice resultado del partido basado en ranking FIFA y promedios de gol."""
    rank_diff = features.team_b_ranking - features.team_a_ranking
    base_prob_a = 0.5 + (rank_diff * 0.005)
    base_prob_a = max(0.1, min(0.9, base_prob_a))

    if features.is_knockout:
        draw_prob = 0.22
    else:
        draw_prob = 0.28

    win_a = base_prob_a * (1 - draw_prob)
    win_b = (1 - base_prob_a) * (1 - draw_prob)

    return {
        "team_a_win": round(win_a, 3),
        "draw": round(draw_prob, 3),
        "team_b_win": round(win_b, 3),
        "expected_goals_a": round(features.team_a_goals_avg * (1 + rank_diff * 0.01), 2),
        "expected_goals_b": round(features.team_b_goals_avg * (1 - rank_diff * 0.01), 2),
    }
