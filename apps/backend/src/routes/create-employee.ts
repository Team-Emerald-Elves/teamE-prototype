import express from "express";
import {prisma} from "../lib/prisma.ts";
import { createClerkClient } from '@clerk/express';
import { createSupabaseForRequest } from '../lib/supabase.ts'

const supabaseClient = await createSupabaseForRequest()

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
    }).then(async (result) => {
        console.log(`Successfully created employee: ${result.first_name} ${result.last_name}`);
        
        await prisma.bucketMeta.create({
            data: {
                employeeId: result.id
            }
        })

        const { data, error } = await supabaseClient
        .storage
        .createBucket('avatars', {
        public: false, // Set to true for a public bucket
        fileSizeLimit: 1024 * 1024 * 10 // Optional: limit size (e.g., 1MB)
        })

        if(!data || error) {
            throw new Error("Cannot create bucket.")
        }


        
        res.sendStatus(200); // Success
    }, (err) => {
        console.error(`[ERROR] Failed to create employee with error: ${err}`);
        res.sendStatus(500); // Failed
    })
}

export default createEmployeeRoute;