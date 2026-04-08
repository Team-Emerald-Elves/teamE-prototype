import express from "express";
import {prisma} from "../lib/prisma.ts";
import { clerkClient } from '@clerk/express';

interface IEmployee {
    id?: string;
    first_name: string;
    last_name: string;
    uname: string;
    email?: string;
    roles?: string[];
}

async function createOldEmployeeRoute(req: express.Request, res: express.Response) {
    const employee: IEmployee = req.body
    console.log("Employee: ", employee)
    let user
    try {
        user = await clerkClient.users.createUser({
            firstName: employee.first_name,
            lastName: employee.last_name,
            emailAddress: [employee.email!],
            username: employee.uname,
            password: "YQkxpzdR4P&HRzcQ3$!",
        })
    } catch (error) {
        console.error("Logged Error: ", error)
        return;
    }

    console.log("Clerk User: ", user);
    prisma.employee.create({
        data: {
            clerkUserId: user!.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            uname: employee.uname,
            email: employee.email,
            roles: employee.roles,
        }
    }).then((result) => {
        console.log(`Successfully created employee: ${result.first_name} ${result.last_name}`);
        res.sendStatus(200); // Success
    }, (err) => {
        console.error(`[ERROR] Failed to create employee with error: ${err}`);
        res.sendStatus(500); // Failed
    })
}

export default createOldEmployeeRoute;