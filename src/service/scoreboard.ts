import { ScoreboardRepository } from '../repository/scoreboard';
import Player from '../model/player';
import Score from '../model/score';

export class ScoreboardService {
    constructor(private scoreboardRepository: ScoreboardRepository) {}

    async getScoreboard(season: number): Promise<Player[]> {
        const scoreboard = await this.scoreboardRepository.fetchScoreboard(season);
        scoreboard.sort((a: Player, b: Player) => {
            if (b.lastPlayed === '' || b.lastPlayed === null) {
                return -1;
            }
            if (a.lastPlayed === '' || a.lastPlayed === null) {
                return 1;
            }
            return b.points > a.points ? 1 : -1;
        });
        return scoreboard;
    }

    async addScoreToScoreboard(score: Score): Promise<Player[]> {
        return await this.scoreboardRepository.addScore(score);
    }

    async getScores(name: string, season: number): Promise<Score[]> {
        return await this.scoreboardRepository.findScores(name, season);
    }

    async deleteScore(id: number): Promise<void> {
        return await this.scoreboardRepository.removeScore(id);
    }
}
