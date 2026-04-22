import Router, { type Request, type Response } from "express"
import { requireAuth, getAuth, clerkClient, type EmailAddress } from '@clerk/express'
import { UpdateLockBodyLink, GetLockQuery } from '../lib/zod/routes.schemas.ts'
import { validate } from "../lib/zod/middleware.ts";
import prisma from "@repo/database";

//import prisma, { Prisma, type Employee } from "@repo/database"

const CheckoutLinks = Router()

// CheckoutLinks.get('/me', requireAuth(), async (req, res) => {
//
//     // Use `getAuth()` to get the user's `userId`
//     const { userId, isAuthenticated } = getAuth(req)
//     const clerkUser = await clerkClient.users.getUser(userId as string)
//
//     if (!isAuthenticated) {
//         return res.status(401).json({ error: "Not authenticated" })
//     }
//
//
//     try {
//         if(!clerkUser) throw new Error("Authenticated user doesn't exist in clerk.")
//
//         const currentUser: Employee = await prisma.employee.upsert({
//             where: { clerkUserId: userId, uname: clerkUser.username as string },
//             update: {},
//             create: {
//                 clerkUserId: userId,
//                 uname: clerkUser.username as string,
//                 first_name: clerkUser.firstName ?? "firstname",
//                 last_name: clerkUser.lastName ?? "lastname",
//                 roles: [ "UnderWriter" ],
//                 bucket: {
//                     create: {
//                         public: true, // Resources avaliable to public.
//                         file_size_limit: 52428800 // 50MB
//                     }
//                 },
//                 email: clerkUser.primaryEmailAddress?.emailAddress ?? "example@email.com"
//             }
//         })
//
//         return res.status(200).json(currentUser)
//     } catch(error: any) {
//         if (error instanceof Prisma.PrismaClientKnownRequestError) {
//             console.log(error.code, error.message)
//         }
//         res.status(403).json({"message":`Employee in clerk but missing supabase record. (${error})`})
//     }
// })

async function updateLinkLock(req: Request, res: Response) {
    try {
        const { id, status } = req.body ?? {}


        console.log("BODY:", req.body)
        console.log("TYPES:", {
            id: typeof req.body?.id,
            status: typeof req.body?.status
        })

        if (typeof id !== "string" || typeof status !== "boolean") {
            return res.status(400).json({
                message: "Invalid body. Expected { id: string, status: boolean }"
            })
        }
        const {userId, isAuthenticated} = getAuth(req)
        if(!isAuthenticated) {
            return res.status(401).json({error: "Not authenticated"})
        }
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId
            }
        })
        if(status){
            await prisma.links.update({
                where: {
                    id: id
                },
                data: {
                    lock: employee.id
                }
            })
        }
        else{
            await prisma.links.update({
                where: {
                    id: id
                },
                data: {
                    lock: "none"
                }
            })
        }

        return res.status(200).json({ id, status })
    } catch (error) {
        return res.status(500).json({ message: "Failed to update lock" })
    }
}

async function getLinkLock(req: Request, res: Response) {
    const id = req.query.id as string;

    if (!id) {
        return res.status(400).json({ message: "Invalid id" });
    }

    try {
        const data = await prisma.links.findFirst({
            where: {
                id: id
            }
        });

        return res.status(200).json(data?.lock);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get lock", error });
    }
}


CheckoutLinks.put('/update-link-lock', validate(UpdateLockBodyLink), updateLinkLock)
CheckoutLinks.get('/get-link-lock', validate(GetLockQuery), (getLinkLock))

export default CheckoutLinks