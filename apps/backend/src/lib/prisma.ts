import { PrismaClient } from "../../prisma/generated/client.ts";
import {PrismaPg} from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { enviroments } from "./env.ts";
dotenv.config();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let dataBaseURL = process.env[(process.env.NODE_ENV?.toUpperCase() ?? "") + "_DIRECT_URL"]

if(process.env.NODE_ENV as string in enviroments) {
    console.log(`Using "${dataBaseURL}" database url.`)
    process.env[process.env.NODE_ENV?.toUpperCase() ?? "" + "DIRECT_URL"]
} else throw new Error("Enviroment not found: " + process.env.NODE_ENV)

export const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter: new PrismaPg({
        connectionString: dataBaseURL
    })
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
