import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import *as dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();


@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy 
{
    private pool: Pool;

    onModuleInit() {
        this.pool = new Pool({
            host:process.env.DATABASE_HOST,
            port:Number(process.env.DATABASE_PORT),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database:process.env.DATABASE_NAME,
            idleTimeoutMillis: 30000,

        });
    }

    async query(sql: string, params: any[] = []) {
    const client = await this.pool.connect();
    try {
            const result = await client.query(sql, params);
            return result.rows;
            } finally {
                client.release();
            }
    }

    async executeScript(sql: string) {
    return this.pool.query(sql);
    }

    async getClient() {
    return await this.pool.connect();
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
