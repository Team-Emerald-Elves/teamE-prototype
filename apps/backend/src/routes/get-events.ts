import express from "express";
import { getAuth } from "@clerk/express";
import prisma, { type CalendarEvents } from "@repo/database";

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
                    .map((e) => e.doc_id)
                    .filter((id) => id !== -1 && id !== null),
            ),
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
            new Set(documents.map((d) => d.content_owner).filter(Boolean)),
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
            documents.map((d) => [d.id, d.content_owner]),
        );

        const ownerNameMap = new Map(
            owners.map((o) => [o.id, `${o.first_name} ${o.last_name}`.trim()]),
        );

        const empIds = Array.from(
            new Set(
                result
                    .map((e) => e.lock)
                    .filter((lock) => lock && lock !== "none"),
            ),
        ) as string[];

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
            employees.map((e) => [
                e.id,
                `${e.first_name} ${e.last_name}`.trim(),
            ]),
        );

        function boostSaturation(hex: string, factor = 1.2) {
            const num = parseInt(hex.replace("#", ""), 16);
            let r = (num >> 16) & 255;
            let g = (num >> 8) & 255;
            let b = num & 255;

            const avg = (r + g + b) / 3;

            r = Math.min(255, Math.max(0, avg + (r - avg) * factor));
            g = Math.min(255, Math.max(0, avg + (g - avg) * factor));
            b = Math.min(255, Math.max(0, avg + (b - avg) * factor));

            return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
        }

        const COLOR_TO_ROLE: Record<string, string> = {
            "#6D28D9": "Administrator",
            "#93C5FD": "BusinessAnalyst",
            "#F9A8D4": "UnderWriter",
            "#2DD4BF": "ExcelOperator",
            "#C4B5FD": "BusinessOperator",
            "#F0ABFC": "ActuarialAnalyst",
        };

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
                color: boostSaturation(event.color, 1.3),
                extendedProps: {
                    lock: event.lock,
                    emp_id: event.emp_id,
                    created_at: event.created_at,
                    checkedOut:
                        event.lock && event.lock !== "none"
                            ? (employeeMap.get(event.lock) ?? null)
                            : "none",
                    contentOwner: contentOwnerName,
                    doc_id: event.doc_id,
                    role: COLOR_TO_ROLE[event.color] ?? null
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
