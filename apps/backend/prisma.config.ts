import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import { enviroments } from './src/lib/env';

const dataBaseURL: string | null = env('NODE_ENV') in enviroments ? env(env('NODE_ENV').toUpperCase() + '_DIRECT_URL') : null

if(!dataBaseURL) {
    throw new Error('Prisma config failed to load proper database URL with enviroment: ' + env('NODE_ENV'))
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
    	path: "prisma/migrations",	
    },
    datasource: {
        url: dataBaseURL
    },
})
