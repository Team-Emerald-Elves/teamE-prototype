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
    prisma.employee.create({
        data: {
            first_name: employee.first_name,
            last_name: employee.last_name,
            uname: employee.uname,
            email: employee.email,
            roles: employee.roles,
        }
    }).then((result) => {
        clerkClient.users.createUser({
            emailAddress: [result.email!],
            password: "password",
            firstName: result.first_name,
            lastName: result.last_name,
        })
        console.log(`Successfully created employee: ${result.first_name} ${result.last_name}`);
        res.sendStatus(200); // Success
    }, (err) => {
        console.error(`[ERROR] Failed to create employee with error: ${err}`);
        res.sendStatus(500); // Failed
    })
}

export default createEmployeeRoute;