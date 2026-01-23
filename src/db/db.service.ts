import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import *as dotenv from 'dotenv';
import { Pool } from 'pg';
import { max } from 'rxjs';
dotenv.config();


@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy 
{
    private pool: Pool;

    onModuleInit() {
        this.pool = new Pool({
            host:process.env.DATABASE_HOST,
            port:Number(process.env.DATABASE_PORT || 5432),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database:process.env.DATABASE_NAME,
            max: 20,
            idleTimeoutMillis: 30000,

        });
    }

    async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
    const res = await this.pool.query<T>(text, params);
    return { rows: res.rows };
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
