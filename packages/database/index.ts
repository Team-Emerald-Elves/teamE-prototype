import { PrismaClient } from './prisma/generated/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'
import { enviroments } from './lib/env.ts'
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Create a reliable __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env files

dotenv.config({
    path: [
        path.resolve(__dirname, '../../apps/backend/.env'),
        path.resolve(__dirname, '.env')
    ]
})

const nodeEnv = process.env.NODE_ENV?.toUpperCase() || "DEVELOPMENT"
const directUrlKey = `${nodeEnv}_DIRECT_URL`

let dataBaseURL = process.env[directUrlKey]

console.log(`Searching for key: ${directUrlKey}`)
console.log(`DB URL: ${dataBaseURL}`)

// 2. Validate environment
if (!(process.env.NODE_ENV! in enviroments)) {
    throw new Error("Environment not found: " + process.env.NODE_ENV)
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter: new PrismaPg({
        connectionString: dataBaseURL // Ensure this isn't undefined
    })
});

export default prisma
export * from './prisma/generated/client.ts'

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma