import express from "express";
import prisma, { type documentContent, type Employee } from "@repo/database";

function favoriteRoute(req: express.Request, res: express.Response) {
    prisma.documentContent
        .findMany({
            where: {
                favorite: true,
            },
            orderBy: {
                name: "asc",
            },
        })
        .then(async (documents) => {
            try {
                // 1. collect unique owner IDs
                const ownerIds = [...new Set(documents.map((d) => d.content_owner))];

                // 2. fetch all employees in one query
                const employees = await prisma.employee.findMany({
                    where: {
                        id: { in: ownerIds as string[] },
                    },
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                });

                // 3. build lookup map
                const employeeMap = new Map(
                    employees.map((emp) => [
                        emp.id,
                        `${emp.first_name} ${emp.last_name}`,
                    ])
                );

                // 4. attach name to documents
                const formatted = documents.map((doc) => ({
                    ...doc,
                    content_owner:
                        employeeMap.get(doc.content_owner as string) || "Unknown",
                }));

                res.json(formatted);
            } catch (err) {
                console.error("[ERROR JOINING EMPLOYEES]", err);
                res.sendStatus(500);
            }
        })
        .catch((err: any) => {
            console.error("[ERROR]", err);
            res.sendStatus(500);
        });
}

export default favoriteRoute;