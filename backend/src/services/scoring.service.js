export const POINTS = {
  PLAYED_60_MIN:    2,
  GOAL_FWD_MID:     6,
  GOAL_DEF_GK:      10,
  ASSIST:           3,
  CLEAN_SHEET:      4,
  SHOTS_PER_3:      1,
  MOTM:             2,
  PENALTY_SAVED:    3,
  YELLOW_CARD:      -1,
  RED_CARD:         -3,
  OWN_GOAL:         -3,
};

export const calculatePlayerPoints = (stats, position) => {
  let points = 0;
  const breakdown = {};

  if (stats.minutes_played >= 60) {
    points += POINTS.PLAYED_60_MIN;
    breakdown.played = POINTS.PLAYED_60_MIN;
  }

  if (stats.goals > 0) {
    const gp = stats.goals * (
      position === 'Defender' || position === 'Goalkeeper'
        ? POINTS.GOAL_DEF_GK : POINTS.GOAL_FWD_MID
    );
    points += gp;
    breakdown.goals = gp;
  }

  if (stats.assists > 0) {
    const ap = stats.assists * POINTS.ASSIST;
    points += ap;
    breakdown.assists = ap;
  }

  if (stats.clean_sheet && (position === 'Goalkeeper' || position === 'Defender')) {
    points += POINTS.CLEAN_SHEET;
    breakdown.clean_sheet = POINTS.CLEAN_SHEET;
  }

  if (stats.shots_on_target >= 3) {
    const sp = Math.floor(stats.shots_on_target / 3) * POINTS.SHOTS_PER_3;
    points += sp;
    breakdown.shots = sp;
  }

  if (stats.is_motm) {
    points += POINTS.MOTM;
    breakdown.motm = POINTS.MOTM;
  }

  if (stats.penalties_saved > 0) {
    const pp = stats.penalties_saved * POINTS.PENALTY_SAVED;
    points += pp;
    breakdown.penalties_saved = pp;
  }

  if (stats.yellow_cards > 0) {
    const yp = stats.yellow_cards * POINTS.YELLOW_CARD;
    points += yp;
    breakdown.yellow_cards = yp;
  }

  if (stats.red_cards > 0) {
    const rp = stats.red_cards * POINTS.RED_CARD;
    points += rp;
    breakdown.red_cards = rp;
  }

  if (stats.own_goals > 0) {
    const op = stats.own_goals * POINTS.OWN_GOAL;
    points += op;
    breakdown.own_goals = op;
  }

  return { points, breakdown };
};
