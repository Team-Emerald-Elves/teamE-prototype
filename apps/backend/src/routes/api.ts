import {
         Router
} from "express"
import { requireAuth, getAuth, clerkClient } from '@clerk/express'
import {prisma} from "../lib/prisma.ts";


const APIRouter = Router()

APIRouter.get('/me', requireAuth(), async (req, res) => {

    let currentUser = "adw"
  
    // Use `getAuth()` to get the user's `userId`
    const { userId, isAuthenticated } = getAuth(req)
    console.log(userId)
    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" })
    }
    try {
        currentUser = await prisma.employee.findFirstOrThrow({
            where: { clerkUserId: userId }
        })
    } catch(error) {
        console.error(error)
    }


    // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId as string)

  return res.status(200).json(currentUser)
})

export default APIRouter