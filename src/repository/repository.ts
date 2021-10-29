import { Client } from 'pg';
import { migrate } from 'postgres-migrations';
import * as path from 'path';

export class Repository {
    client: Client;
    constructor(client: Client) {
        this.client = client;
        this.client.connect();
        migrate({ client }, path.join(__dirname, '../../assets')).catch((error) => {
            throw new Error(error);
        });
    }
}
