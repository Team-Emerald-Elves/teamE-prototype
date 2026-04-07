import express from "express";
import {prisma} from "../lib/prisma.ts";

interface IEmployee {
    id?: string;
    first_name: string;
    last_name: string;
    uname: string;
    email?: string;
    roles?: string[];
}

function createEmployeeRoute(req: express.Request, res: express.Response) {
    const employee: IEmployee = req.body as IEmployee;
    prisma.employee.create({
        data: {
            first_name: employee.first_name,
            last_name: employee.last_name,
            uname: employee.uname,
            email: employee.email,
        }
    }).then((result) => {
        console.log(`Successfully created employee: ${result.first_name} ${result.last_name}`);
        res.sendStatus(200); // Success
    }, (err) => {
        console.error(`[ERROR] Failed to creat employee with error: ${err}`);
        res.sendStatus(500); // Failed
    })
}

export default createEmployeeRoute;