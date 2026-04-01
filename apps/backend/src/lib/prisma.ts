import { PrismaClient } from "../../prisma/generated/client";
import {PrismaPg} from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log(process.env.DIRECT_URL)

export const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DIRECT_URL,
    })
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
