import dotenv from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";
import { enviroments } from "./lib/env.ts";
import { fileURLToPath } from "url";

// 1. Create a reliable __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env files

dotenv.config({
    path: [
        path.resolve(__dirname, "../../apps/backend/.env"),
        path.resolve(__dirname, ".env"),
    ],
});

const dataBaseURL: string | null =
    env("NODE_ENV") in enviroments
        ? env(env("NODE_ENV").toUpperCase() + "_DIRECT_URL")
        : null;

console.log("Primsa> DB URL from config: " + dataBaseURL);

if (!dataBaseURL) {
    throw new Error(
        "Prisma config failed to load proper database URL with enviroment: " +
            env("NODE_ENV"),
    );
}

export default defineConfig({
    schema: path.join("prisma", "schematics"),
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: dataBaseURL,
    },
});
