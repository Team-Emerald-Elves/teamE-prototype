import express from "express";
import prisma, { type Employee } from "@repo/database";
import { createClerkClient, type User } from '@clerk/express';
import { createSupabaseForRequest } from '../lib/supabase.ts'
import { randomBytes } from "node:crypto";
import { invite } from "./api.ts";

const supabaseClient = await createSupabaseForRequest()


const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function createEmployeeRoute(req: express.Request, res: express.Response) {
    const employee: Employee = req.body
    console.log("Employee: ", employee)
    let user: User
    const tempPwd: string = randomBytes(12).toString('base64url');
    try {
        user = await clerkClient.users.createUser({
            firstName: employee.first_name,
            lastName: employee.last_name,
            emailAddress: [employee.email!],
            username: employee.uname,
            password: tempPwd,
        })
        invite(req, res);

    } catch (error) {
        console.error("Logged Error: ", error)
        return;
    }

    console.log("Clerk User: ", user);
    prisma.employee.create({
        data: {
            ...employee,
            clerkUserId: user!.id
        }
    }).then(async (result) => {
        console.log(`Successfully created employee: ${result.first_name} ${result.last_name}`);

        const bucketData = await prisma.bucketMeta.create({
            data: {
                employeeId: result.id
            }
        })

        if (process.env.NODE_ENV != 'development') {
            const { data, error } = await supabaseClient
            .storage
            .createBucket(bucketData.id, {
            public: false, // Set to true for a public bucket
            fileSizeLimit: 1024 * 1024 * 10 // Optional: limit size (e.g., 1MB)
            })

            if(!data || error) {
                throw new Error("Cannot create bucket.")
            }
        } else {
            console.error("Cannot create buckets with development db. Only records")
        }


        
        res.sendStatus(200); // Success
    }, (err) => {
        console.error(`[ERROR] Failed to create employee with error: ${err}`);
        res.sendStatus(500); // Failed
    })
}

export default createEmployeeRoute;