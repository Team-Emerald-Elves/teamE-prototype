import express from "express";
import { getAuth } from "@clerk/express";
import prisma from "@repo/database";

async function addEventRoute(req: express.Request, res: express.Response) {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId,
            },
        });

        const employee_id = employee.id;

        const { title, start_date, end_date, all_day } = req.body;

        if (!title || !start_date) {
            return res.status(400).json({
                error: "Missing required fields",
            });
        }

        const newEvent = await prisma.calendarEvents.create({
            data: {
                title,
                start_date: new Date(start_date),
                end_date: end_date ? new Date(end_date) : null,
                all_day: all_day ?? false,
                emp_id: employee_id,
                lock: employee_id,
                color: "#3b82f6",
            },
        });

        console.log(newEvent);

        return res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create event",
        });
    }
}

export default addEventRoute;
