import dotenv from 'dotenv-defaults';
import { env } from 'process';
dotenv.config();

const port = e('PORT', 'integer');
const nodeEnv = e('NODE_ENV');
const dbHost = e('DATABASE_URL');
const dbUser = e('DB_USERNAME', 'string');
const dbPassword = e('DB_PASSWORD');

export default {
    port: port,
    env: nodeEnv,
    db: {
        host: dbHost,
        user: dbUser,
        password: dbPassword,
    },
};

function e(key: string): string;
function e(key: string, type: 'string'): string;
function e(key: string, type: 'integer'): number;
function e(key: string, type: 'string' | 'integer' = 'string'): string | number {
    const value = env[key];

    let toReturn: string | number | boolean | undefined | null;
    if (type === 'string') {
        toReturn = value;
    } else if (type === 'integer') {
        toReturn = value ? parseInt(value) : undefined;
    } else {
        throw new Error(`Unknown configuration type '${key}'`);
    }

    if (toReturn === null || toReturn === undefined) {
        toReturn = 'dummyValue';
    }

    return toReturn;
}
