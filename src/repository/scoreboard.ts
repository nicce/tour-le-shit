import { QueryResult } from 'pg';
import Player from '../model/player';
import Score from '../model/score';
import { query } from './db';
import { PlayerEntity } from './model/playerEntity';
import { ScoreEntity } from './model/scoreEntity';
import { Repository } from './repository';

export class ScoreboardRepository extends Repository {
    async fetchScoreboard(season: number): Promise<Player[]> {
        const qry = 'SELECT name,points,holderofsnek,lastplayed,season from scoreboard where season=$1';
        const values = [season];
        const res: QueryResult<PlayerEntity> = await query<PlayerEntity>(this.client, qry, values);

        return res.rows.map((row: PlayerEntity) => {
            return {
                name: row.name,
                points: row.points,
                holderOfSnek: row.holderofsnek,
                lastPlayed: row.lastplayed,
                season: row.season,
            };
        });
    }

    async findScores(name: string, season: number): Promise<Score[]> {
        const qry =
            'SELECT id,name,points,holderofsnek,nettotweets,nettoeagles,muligans,date,season from score where name=$1 AND season=$2';
        const values = [name, season];
        const res: QueryResult<ScoreEntity> = await query<ScoreEntity>(this.client, qry, values);

        return res.rows.map((row: ScoreEntity) => {
            return {
                id: row.id,
                name: row.name,
                points: row.points,
                holderOfSnek: row.holderofsnek,
                nettoTweets: row.nettotweets,
                nettoEagles: row.nettoeagles,
                muligans: row.muligans,
                date: row.date,
                season: row.season,
            };
        });
    }

    async addScore(score: Score): Promise<Player[]> {
        const qry =
            'INSERT INTO score(name, points, holderOfSnek, nettoTweets, nettoEagles, muligans, date, season) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
        const values = [
            score.name,
            score.points,
            score.holderOfSnek,
            score.nettoTweets,
            score.nettoEagles,
            score.muligans,
            new Date().toISOString().split('T')[0],
            score.season,
        ];

        await query(this.client, qry, values);
        return await this.updateScoreboard(score);
    }

    async removeScore(id: number): Promise<void> {
        const values = [id];
        const select_qry =
            'SELECT id,name,points,nettotweets,nettoeagles,muligans,date,holderofsnek,season FROM score where id=$1';
        const delete_qry = 'DELETE FROM score where id=$1';

        const res = await query<ScoreEntity>(this.client, select_qry, values);
        const score: Score = {
            id: res.rows[0].id,
            name: res.rows[0].name,
            points: res.rows[0].points,
            nettoTweets: res.rows[0].nettotweets,
            nettoEagles: res.rows[0].nettoeagles,
            muligans: res.rows[0].muligans,
            date: res.rows[0].date,
            holderOfSnek: res.rows[0].holderofsnek,
            season: res.rows[0].season,
        };

        await query(this.client, delete_qry, values);
        await this.removeFromScoreboard(score);
    }

    private async removeFromScoreboard(score: Score): Promise<void> {
        const points = this.calculatePoints(score.points, score.nettoTweets, score.nettoEagles, score.muligans);
        const lastPlayed = await this.getLastPlayedDate(score.name, score.season);
        const qry =
            'UPDATE scoreboard set points=points-$1, lastplayed=$2, holderofsnek=false where name=$3 AND season=$4';
        const values = [points, lastPlayed, score.name, score.season];

        await query(this.client, qry, values);
    }

    private async findPlayer(name: string, season: number): Promise<Player> {
        const qry = 'SELECT points,holderofsnek,lastplayed,name,season from scoreboard where name=$1 and season=$2';
        const values = [name, season];
        const res = await query<PlayerEntity>(this.client, qry, values);
        // Should only be one hit
        const data = res.rows[0];
        return {
            points: data.points,
            holderOfSnek: data.holderofsnek,
            lastPlayed: data.lastplayed,
            name: data.name,
            season: data.season,
        };
    }

    private async updateScoreboard(score: Score): Promise<Player[]> {
        const player = await this.findPlayer(score.name, score.season);
        const updatedPlayer = this.updatePlayerScore(score, player);
        const qry = 'UPDATE scoreboard set points=$1, holderOfSnek=$2, lastPlayed=$3 where name=$4 AND season=$5';
        const values = [
            updatedPlayer.points,
            updatedPlayer.holderOfSnek,
            updatedPlayer.lastPlayed,
            updatedPlayer.name,
            score.season,
        ];
        await query(this.client, qry, values);
        if (score.holderOfSnek) {
            await this.updateSnekHolder(score.name, score.season);
        }
        return await this.fetchScoreboard(score.season);
    }

    private calculatePoints(stablePoints: number, nettoTweets: number, nettoEagles: number, muligans: number): number {
        const tweetPoints = 2 * nettoTweets;
        const eaglePoints = 3 * nettoEagles;
        const muliganPoints = 3 * muligans;
        return stablePoints + tweetPoints + eaglePoints - muliganPoints;
    }

    private updatePlayerScore(score: Score, player: Player): Player {
        const scorePoint = this.calculatePoints(score.points, score.nettoTweets, score.nettoEagles, score.muligans);
        player.points += scorePoint;
        player.lastPlayed = new Date().toISOString().split('T')[0];
        player.holderOfSnek = score.holderOfSnek;

        return player;
    }

    async updateSnekHolder(newSnekHolder: string, season: number): Promise<void> {
        const qry = 'UPDATE scoreboard set holderOfSnek=false where name !=$1 and season=$2';
        const values = [newSnekHolder, season];
        await query(this.client, qry, values);
    }

    async getLastPlayedDate(name: string, season: number): Promise<string> {
        const qry = 'SELECT MAX(date) as lastplayed from score where name=$1 AND season=$2';
        const values = [name, season];
        const res = await query<{ lastplayed: string }>(this.client, qry, values);
        const data = res.rows[0];
        return data.lastplayed;
    }
}
