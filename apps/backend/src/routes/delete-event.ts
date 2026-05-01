import express from "express";
import { getAuth } from "@clerk/express";
import prisma from "@repo/database";

async function deleteEventRoute(req: express.Request, res: express.Response) {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Missing event id" });
        }

        const updated = await prisma.calendarEvents.delete({
            where: {
                id: Number(id),
            },
        });

        return res.json(updated);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update event",
        });
    }
}

export default deleteEventRoute;
