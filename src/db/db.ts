import { Client } from 'pg';
import Player from '../model/player';
import Score from '../model/score';

export class ScoreboardRepository {
    constructor(private client: Client) {
        client.connect();
    }

    async fetchScoreboard(): Promise<Player[]> {
        const qry = 'SELECT name,points,holderofsnek,lastplayed from scoreboard';
        const res = await this.query(qry, []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return res.rows.map((row: any) => {
            return {
                name: row.name,
                points: row.points,
                holderOfSnek: row.holderofsnek,
                lastPlayed: row.lastplayed,
            };
        });
    }

    async findScores(name: string): Promise<Score[]> {
        const qry = 'SELECT id,name,points,holderofsnek,nettotweets,nettoeagles,muligans,date from score where name=$1';
        const values = [name];
        const res = await this.query(qry, values);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return res.rows.map((row: any) => {
            return {
                id: row.id,
                name: row.name,
                points: row.points,
                holderOfSnek: row.holderofsnek,
                nettoTweets: row.nettotweets,
                nettoEagles: row.nettoeagles,
                muligans: row.muligans,
                date: row.date,
            };
        });
    }

    async addScore(score: Score): Promise<Player[]> {
        const qry =
            'INSERT INTO score(name, points, holderOfSnek, nettoTweets, nettoEagles, muligans, date) VALUES($1, $2, $3, $4, $5, $6, $7)';
        const values = [
            score.name,
            score.points,
            score.holderOfSnek,
            score.nettoTweets,
            score.nettoEagles,
            score.muligans,
            new Date().toISOString().split('T')[0],
        ];

        await this.query(qry, values);
        return await this.updateScoreboard(score);
    }

    async removeScore(id: number): Promise<void> {
        const values = [id];
        const select_qry =
            'SELECT id,name,points,nettotweets,nettoeagles,muligans,date,holderofsnek FROM score where id=$1';
        const delete_qry = 'DELETE FROM score where id=$1';

        const res = await this.query(select_qry, values);
        const score: Score = {
            id: res.rows[0].id,
            name: res.rows[0].name,
            points: res.rows[0].points,
            nettoTweets: res.rows[0].nettotweets,
            nettoEagles: res.rows[0].nettoeagles,
            muligans: res.rows[0].muligans,
            date: res.rows[0].date,
            holderOfSnek: res.rows[0].holderOfSnek,
        };

        await this.query(delete_qry, values);
        await this.removeFromScoreboard(score);
    }

    private async removeFromScoreboard(score: Score): Promise<void> {
        const points = this.calculatePoints(score.points, score.nettoTweets, score.nettoEagles, score.muligans);
        const lastPlayed = await this.getLastPlayedDate(score.name);
        const qry = 'UPDATE scoreboard set points=points-$1, lastplayed=$2, holderofsnek=false where name=$3';
        const values = [points, lastPlayed, score.name];

        await this.query(qry, values);
    }

    private async findPlayer(name: string): Promise<Player> {
        const qry = 'SELECT points,holderofsnek,lastplayed,name from scoreboard where name=$1';
        const values = [name];
        const res = await this.query(qry, values);
        // Should only be one hit
        const data = res.rows[0];
        return {
            points: data.points,
            holderOfSnek: data.holderOfSnek,
            lastPlayed: data.lastPlayed,
            name: data.name,
        };
    }

    private async updateScoreboard(score: Score): Promise<Player[]> {
        const player = await this.findPlayer(score.name);
        const updatedPlayer = this.updatePlayerScore(score, player);
        const qry = 'UPDATE scoreboard set points=$1, holderOfSnek=$2, lastPlayed=$3 where name=$4';
        const values = [updatedPlayer.points, updatedPlayer.holderOfSnek, updatedPlayer.lastPlayed, updatedPlayer.name];
        await this.query(qry, values);
        if (score.holderOfSnek) {
            await this.updateSnekHolder(score.name);
        }
        return await this.fetchScoreboard();
    }

    private calculatePoints(stablePoints: number, nettoTweets: number, nettoEagles: number, muligans: number): number {
        const tweetPoints = 2 * nettoTweets;
        const eaglePoints = 3 * nettoEagles;
        const muliganPoints = 3 * muligans;
        return stablePoints + tweetPoints + eaglePoints - muliganPoints;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async query(qry: string, values: any[]): Promise<any> {
        try {
            return await this.client.query(qry, values);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    private updatePlayerScore(score: Score, player: Player): Player {
        const scorePoint = this.calculatePoints(score.points, score.nettoTweets, score.nettoEagles, score.muligans);
        player.points += scorePoint;
        player.lastPlayed = new Date().toISOString().split('T')[0];
        player.holderOfSnek = score.holderOfSnek;

        return player;
    }

    async updateSnekHolder(newSnekHolder: string): Promise<void> {
        const qry = 'UPDATE scoreboard set holderOfSnek=false where name !=$1';
        const values = [newSnekHolder];
        await this.query(qry, values);
    }

    async getLastPlayedDate(name: string): Promise<string> {
        const qry = 'SELECT MAX(date) as lastplayed from score where name=$1';
        const values = [name];
        const res = await this.query(qry, values);
        const data = res.rows[0];
        return data.lastplayed;
    }
}
