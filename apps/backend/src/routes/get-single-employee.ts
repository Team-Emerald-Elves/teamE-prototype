import express from "express";
import { prisma } from "../lib/prisma.ts";

interface IData {
    id: string;
}

async function singleEmployeeRoute(req: express.Request, res: express.Response) {
    try {
        const data = req.body as IData;

        const emp = await prisma.employee.findUniqueOrThrow({
            where: {
                id: data.id,
            }
        });
        const empFound = res.json(emp);
        console.log(empFound)
        return empFound;
    } catch (err) {
        console.error("[ERROR]", err);
        return res.sendStatus(500);
    }
}

export default singleEmployeeRoute;

