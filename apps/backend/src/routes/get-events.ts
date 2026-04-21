import express from "express";
import { getAuth } from "@clerk/express";
import prisma, {type CalendarEvents} from "@repo/database";

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


        const result: CalendarEvents[] = await prisma.calendarEvents.findMany({
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

        const formattedEvents = result.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: event.start_date,
            end: event.end_date,
            allDay: event.all_day,
            extendedProps: {
                lock: event.lock,
                emp_id: event.emp_id,
            }
        }));

        return res.json(formattedEvents);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch favorites" });
    }
}

export default eventsRoute;