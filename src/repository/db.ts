import { Client, QueryResult } from 'pg';

export const query = async <T>(client: Client, qry: string, values: unknown[]): Promise<QueryResult<T>> => {
    try {
        return await client.query<T>(qry, values);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
