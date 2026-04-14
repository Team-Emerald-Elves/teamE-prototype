import express from "express";
import { prisma } from "../lib/prisma.ts";

function favoriteRoute(req: express.Request, res: express.Response) {
    prisma.documentContent
        .findMany({
            where : {
                favorite: true,
            },
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
export default favoriteRoute;
