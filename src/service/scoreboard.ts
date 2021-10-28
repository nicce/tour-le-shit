import { ScoreboardRepository } from '../db/db';
import Player from '../model/player';
import Score from '../model/score';

export class ScoreboardService {
    constructor(private scoreboardRepository: ScoreboardRepository) {}

    async getScoreboard(): Promise<Player[]> {
        return this.scoreboardRepository.fetchScoreboard();
    }

    async addScoreToScoreboard(score: Score): Promise<Player[]> {
        return await this.scoreboardRepository.addScore(score);
    }

    async getScores(name: string): Promise<Score[]> {
        return await this.scoreboardRepository.findScores(name);
    }

    async deleteScore(id: number): Promise<void> {
        return await this.scoreboardRepository.removeScore(id);
    }
}
