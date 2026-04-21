import express from "express";
import { getAuth } from "@clerk/express";
import prisma from "@repo/database";

async function updateEventRoute(req: express.Request, res: express.Response) {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const {
            id,
            title,
            start_date,
            end_date,
            all_day,
        } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Missing event id" });
        }

        const updated = await prisma.calendarEvents.update({
            where: {
                id: Number(id),
            },
            data: {
                title,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : null,
                all_day,
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

export default updateEventRoute;