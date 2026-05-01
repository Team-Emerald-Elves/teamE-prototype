import express from "express";
import prisma from "@repo/database";

function assignedRoute(req: express.Request, res: express.Response) {
    prisma.serviceRequests
        .findMany({
            orderBy: {
                created_at: "asc",
            },
            where: {
                assigned_id: { not: null },
            },
        })
        .then(
            (value) => {
                res.json(value);
            },
            (err) => {
                console.error("[ERROR]", err);
                res.sendStatus(500);
            },
        );
}

export default assignedRoute;
