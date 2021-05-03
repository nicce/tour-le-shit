import { Client } from 'pg';
import Player from '../model/player';
import Score from '../model/score';
import config from '../config';

let client: Client;
if (config.env !== 'production') {
    client = new Client({
        host: config.db.host,
        port: 5432,
        user: config.db.user,
        password: config.db.password,
        database: 'tourleshit',
    });
} else {
    client = new Client({
        connectionString: config.db.host,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}
client.connect();

export async function fetchScoreboard(): Promise<Player[]> {
    const qry = 'SELECT name,points,holderofsnek,lastplayed from scoreboard';
    const res = await query(qry, []);
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

export async function findScores(name: string): Promise<Score[]> {
    const qry = 'SELECT id,name,points,holderofsnek,nettotweets,nettoeagles,muligans,date from score where name=$1';
    const values = [name];
    const res = await query(qry, values);
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

export async function addScore(score: Score): Promise<Player[]> {
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

    await query(qry, values);
    return await updateScoreboard(score);
}

export async function removeScore(id: number): Promise<void> {
    const values = [id];
    const select_qry =
        'SELECT id,name,points,nettotweets,nettoeagles,muligans,date,holderofsnek FROM score where id=$1';
    const delete_qry = 'DELETE FROM score where id=$1';

    const res = await query(select_qry, values);
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

    await query(delete_qry, values);
    await removeFromScoreboard(score);
}

async function removeFromScoreboard(score: Score) {
    const points = calculatePoints(score.points, score.nettoTweets, score.nettoEagles, score.muligans);
    const lastPlayed = await getLastPlayedDate(score.name);
    const qry = 'UPDATE scoreboard set points=points-$1, lastplayed=$2, holderofsnek=false where name=$3';
    const values = [points, lastPlayed, score.name];

    await query(qry, values);
}

async function findPlayer(name: string): Promise<Player> {
    const qry = 'SELECT points,holderofsnek,lastplayed,name from scoreboard where name=$1';
    const values = [name];
    const res = await query(qry, values);
    // Should only be one hit
    const data = res.rows[0];
    return {
        points: data.points,
        holderOfSnek: data.holderOfSnek,
        lastPlayed: data.lastPlayed,
        name: data.name,
    };
}

async function updateScoreboard(score: Score): Promise<Player[]> {
    const player = await findPlayer(score.name);
    const updatedPlayer = updatePlayerScore(score, player);
    const qry = 'UPDATE scoreboard set points=$1, holderOfSnek=$2, lastPlayed=$3 where name=$4';
    const values = [updatedPlayer.points, updatedPlayer.holderOfSnek, updatedPlayer.lastPlayed, updatedPlayer.name];
    await query(qry, values);
    if (score.holderOfSnek) {
        await updateSnekHolder(score.name);
    }
    return await fetchScoreboard();
}

function calculatePoints(stablePoints: number, nettoTweets: number, nettoEagles: number, muligans: number): number {
    let basePoint = stablePoints < 30 ? 30 - 36 : stablePoints - 36;
    if (basePoint > 0) {
        basePoint = basePoint * 2;
    }
    const tweetPoints = 2 * nettoTweets;
    const eaglePoints = 3 * nettoEagles;
    const muliganPoints = 2 * muligans;
    return basePoint + tweetPoints + eaglePoints - muliganPoints;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function query(qry: string, values: any[]): Promise<any> {
    try {
        return await client.query(qry, values);
    } catch (err) {
        console.log(err);
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

async function updateSnekHolder(newSnekHolder: string) {
    const qry = 'UPDATE scoreboard set holderOfSnek=false where name !=$1';
    const values = [newSnekHolder];
    await query(qry, values);
}

async function getLastPlayedDate(name: string) {
    const qry = 'SELECT MAX(date) as lastplayed from score where name=$1';
    const values = [name];
    const res = await query(qry, values);
    const data = res.rows[0];
    return data.lastplayed;
}
