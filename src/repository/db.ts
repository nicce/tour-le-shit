import { Client, QueryResult } from 'pg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = async <T>(client: Client, qry: string, values: any[]): Promise<QueryResult<T>> => {
    try {
        return await client.query<T>(qry, values);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
