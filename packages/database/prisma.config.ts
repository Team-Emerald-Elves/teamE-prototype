import 'dotenv/config';
import path from "node:path";
import { defineConfig, env } from 'prisma/config';
import { enviroments } from './lib/env.ts';

const dataBaseURL: string | null = env('NODE_ENV') in enviroments ? env(env('NODE_ENV').toUpperCase() + '_DIRECT_URL') : null

if(!dataBaseURL) {
    throw new Error('Prisma config failed to load proper database URL with enviroment: ' + env('NODE_ENV'))
}

export default defineConfig({
    schema: path.join("prisma", "schematics"),
    migrations: {
    	path: "prisma/migrations",
    },
    datasource: {
        url: dataBaseURL
    },
})