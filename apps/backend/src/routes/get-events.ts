import express from "express";
import { getAuth } from "@clerk/express";
import prisma from "@repo/database";

async function eventsRoute(req: express.Request, res: express.Response) {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        //get employee currently signed in
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId,
            },
        });

       const employee_id = employee.id;


        const result = await prisma.calendarEvents.findMany({
            where: {
                OR: [
                    {
                        emp_id: employee_id,
                    },
                    {
                        emp_id: null,
                    },
                ],
            },
        });

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch favorites" });
    }
}

export default eventsRoute;