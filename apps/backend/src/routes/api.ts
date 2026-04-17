import Router, { request, response, type Request, type Response } from "express"
import { requireAuth, getAuth, clerkClient } from '@clerk/express'
import { prisma } from "../lib/prisma.ts";
import { UpdateLockBody, GetLockQuery } from '../lib/zod/routes.schemas.ts'
import { validate } from "../lib/zod/middleware.ts";


const APIRouter = Router()

APIRouter.get('/me', requireAuth(), async (req, res) => {
  
    // Use `getAuth()` to get the user's `userId`
    const { userId, isAuthenticated } = getAuth(req)
    const clerkUser = await clerkClient.users.getUser(userId as string)
    console.log(userId)

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" })
    }

    // id: string;
    // clerkUserId: string | null;
    // uname: string;
    // first_name: string;
    // last_name: string;
    // roles: UserRoles[];
    // email: string | null;

    let currentUser = null

    try {
        currentUser = await prisma.employee.findFirstOrThrow({
            where: { clerkUserId: userId }
        })
    } catch(error) {

        if(!clerkUser) throw new Error("Authenticated user doesn't exist in clerk.")

        currentUser = await prisma.employee.create({
            data: {
                clerkUserId: userId,
                uname: clerkUser.username as string,
                first_name: "admin",
                last_name: "1",
                roles: ["UnderWriter"],
                bucket: {
                    create: {}
                },
                email: clerkUser.emailAddresses[0]?.emailAddress
            }
        })
    }

  if(currentUser)
    res.status(200).json(currentUser)
  else
    res.sendStatus(403).json({"message":"Employee in clerk but missing supabase record."})
})

async function updateLock(req: Request, res: Response) {
    try {
        const { id, status } = req.body ?? {}


        console.log("BODY:", req.body)
        console.log("TYPES:", {
            id: typeof req.body?.id,
            status: typeof req.body?.status
        })

        if (typeof id !== "number" || typeof status !== "boolean") {
            return res.status(400).json({
                message: "Invalid body. Expected { id: number, status: boolean }"
            })
        }

        await prisma.documentContent.update({
            where: {
                id: id
            },
            data: {
                lock: status
            }
        })

        return res.status(200).json({ id, status })
    } catch (error) {
        console.error("updateLock error:", error)
        return res.status(500).json({ message: "Failed to update lock" })
    }
}

async function getLock(req: Request, res: Response) {
    const id = Number(req.query.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
    }

    try {
        const data = await prisma.documentContent.findFirst({
            where: {
                id: id
            }
        });

        return res.status(200).json(data?.lock);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get lock", error });
    }
}

APIRouter.put('/update-lock', validate(UpdateLockBody), updateLock)
APIRouter.get('/get-lock', validate(GetLockQuery), (getLock))

export default APIRouter