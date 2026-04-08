import express from "express";
import { prisma } from "../lib/prisma.ts";

function contentRoute(req: express.Request, res: express.Response) {
    prisma.content
        .findMany({
            orderBy: {
                name: "asc",
            },
        })
        .then(
            (value) => {
                res.json(value);
            },
            (err) => {
                console.error("[ERROR]", err);
                res.sendStatus(500);
            }
        );
}
export default contentRoute;
