import {
         Router
} from "express"
import { requireAuth, getAuth, clerkClient } from '@clerk/express'
import {prisma} from "../lib/prisma.ts";


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
                first_name: clerkUser.firstName as string,
                last_name: clerkUser.lastName as string,
                roles: [],
                email: clerkUser.emailAddresses[0]?.emailAddress
            }
        })
    }

  if(currentUser)
    res.status(200).json(currentUser)
  else
    res.sendStatus(403).json({"message":"Employee in clerk but missing supabase record."})
})

export default APIRouter