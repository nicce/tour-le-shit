import Player from '../model/player';
import Score from '../model/score';
import { fetchScoreboard, addScore, findScores } from '../db/db';

export async function getScoreboard(): Promise<Player[]> {
    return fetchScoreboard();
}

export async function addScoreToScoreboard(score: Score): Promise<void> {
    await addScore(score);
}

export async function getScores(name: string): Promise<Score[]> {
    return await findScores(name);
}
