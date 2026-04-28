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


        const empIds = Array.from(
            new Set(
                result
                    .map(e => e.lock)
                    .filter((lock) => lock && lock !== "none")
            )
        ) as string[]

        const employees = await prisma.employee.findMany({
            where: {
                id: { in: empIds },
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
            },
        });

        const employeeMap = new Map(
            employees.map(e => [
                e.id,
                `${e.first_name} ${e.last_name}`.trim(),
            ])
        );

        const formattedEvents = result.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: event.start_date,
            end: event.end_date,
            allDay: event.all_day,
            color: event.color,
            extendedProps: {
                lock: event.lock,
                emp_id: event.emp_id,
                created_at: event.created_at,
                checkedOut:
                    event.lock && event.lock !== "none"
                        ? (employeeMap.get(event.lock) ?? null)
                        : 'none',
            },
        }));

        return res.json(formattedEvents);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch favorites" });
    }
}

export default eventsRoute;