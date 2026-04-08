import express from "express";
import {prisma} from "../lib/prisma.ts";
import { createClerkClient } from '@clerk/backend';

interface IEmployee {
    id?: string;
    first_name: string;
    last_name: string;
    uname: string;
    email?: string;
    roles?: string[];
}

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function createEmployeeRoute(req: express.Request, res: express.Response) {
    const employee: IEmployee = req.body
    const user = await clerkClient.users.createUser({
        emailAddress: [employee.email!],
        password: "password",
        firstName: employee.first_name,
        lastName: employee.last_name,
    })
    prisma.employee.create({
        data: {
            clerkUserId: user.id,
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

export default createEmployeeRoute;