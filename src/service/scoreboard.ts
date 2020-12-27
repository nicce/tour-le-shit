import dotenv from 'dotenv';
import path from 'path';
import Player from '../model/player';
import Score from '../model/score';
import { Client } from 'pg';

dotenv.config({ path: path.join(__dirname, '../../.env') });

let client: Client;
if (process.env.NODE_ENV !== 'production') {
    client = new Client({
        host: process.env.DATABASE_URL,
        port: 5432,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'tourleshit',
    });
} else {
    client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}
client.connect();

export async function getScoreboard(): Promise<Player[]> {
    const query = 'SELECT * from scoreboard';
    try {
        const res = await client.query(query);
        return res.rows.map((row) => {
            console.log(row);
            return {
                name: row.name,
                points: row.points,
                holderOfSnek: row.holderofsnek,
                lastPlayed: row.lastplayed,
            };
        });
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function addScoreToScoreboard(score: Score): Promise<void> {
    const player = await getPlayer(score.name);
    const updatedPlayer = updatePlayerScore(score, player);
    const query = 'UPDATE scoreboard set points=$1, holderOfSnek=$2, lastPlayed=$3 where name=$4';
    const values = [updatedPlayer.points, updatedPlayer.holderOfSnek, updatedPlayer.lastPlayed, updatedPlayer.name];
    try {
        await client.query(query, values);
    } catch (err) {
        console.error(err);
        throw err;
    }
    if (score.holderOfSnek) {
        await updateSnek(score.name);
    }
}

async function updateSnek(newSnekHolder: string) {
    const query = 'UPDATE scoreboard set holderOfSnek=false where name !=$1';
    const values = [newSnekHolder];
    try {
        await client.query(query, values);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getPlayer(name: string): Promise<Player> {
    const query = 'SELECT * from scoreboard where name=$1';
    const values = [name];
    try {
        const res = await client.query(query, values);
        // Should only be one hit
        const data = res.rows[0];
        return {
            points: data.points,
            holderOfSnek: data.holderOfSnek,
            lastPlayed: data.lastPlayed,
            name: data.name,
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function updatePlayerScore(score: Score, player: Player): Player {
    const scorePoint = calculatePoints(score.points, score.nettoTweets, score.nettoEagles, score.muligans);
    player.points += scorePoint;
    player.lastPlayed = new Date().toISOString().split('T')[0];
    player.holderOfSnek = score.holderOfSnek;

    return player;
}

export function calculatePoints(
    stablePoints: number,
    nettoTweets: number,
    nettoEagles: number,
    muligans: number,
): number {
    let basePoint = stablePoints < 30 ? 30 - 36 : stablePoints - 36;
    if (basePoint > 0) {
        basePoint = basePoint * 2;
    }
    const tweetPoints = 2 * nettoTweets;
    const eaglePoints = 3 * nettoEagles;
    const muliganPoints = 2 * muligans;
    return basePoint + tweetPoints + eaglePoints - muliganPoints;
}
