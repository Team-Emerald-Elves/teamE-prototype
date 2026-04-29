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

        const docIds = Array.from(
            new Set(
                result
                    .map(e => e.doc_id)
                    .filter((id) => id !== -1 && id !== null)
            )
        ) as number[];

        const documents = await prisma.documentContent.findMany({
            where: {
                id: { in: docIds },
            },
            select: {
                id: true,
                content_owner: true,
            },
        });

        const ownerIds = Array.from(
            new Set(documents.map(d => d.content_owner).filter(Boolean))
        ) as string[];

        const owners = await prisma.employee.findMany({
            where: {
                id: { in: ownerIds },
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
            },
        });

        const docToOwnerMap = new Map(
            documents.map(d => [d.id, d.content_owner])
        );

        const ownerNameMap = new Map(
            owners.map(o => [
                o.id,
                `${o.first_name} ${o.last_name}`.trim(),
            ])
        );


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

        const formattedEvents = result.map((event: any) => {
            let contentOwnerName: string | null = null;

            if (event.doc_id !== -1) {
                const ownerId = docToOwnerMap.get(event.doc_id);
                if (ownerId) {
                    contentOwnerName = ownerNameMap.get(ownerId) ?? null;
                }
            }

            return {
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
                    contentOwner: contentOwnerName,
                },
            };
        });

        return res.json(formattedEvents);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch favorites" });
    }
}

export default eventsRoute;