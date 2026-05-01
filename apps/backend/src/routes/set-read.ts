import express from "express";
import { getAuth } from "@clerk/express";
import prisma from "@repo/database";

async function setReadRoute(req: express.Request, res: express.Response) {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId,
            },
        });

        const updatedEmp = await prisma.employee.update({
            where: {
                id: employee.id,
            },
            data: {
                unreadNotif: false,
            },
        });

        return res.status(200).json({ updatedEmp });
    } catch (error) {
        res.status(400).send(error);
    }
}

export default setReadRoute;
