import dotenv from 'dotenv-defaults';

dotenv.config();

const port = process.env.PORT;
const nodeEnv = process.env.NODE_ENV;
const dbHost = process.env.DATABASE_URL;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const config = {
    port: port,
    env: nodeEnv,
    db: {
        host: dbHost,
        user: dbUser,
        password: dbPassword,
    },
};

export default config;
