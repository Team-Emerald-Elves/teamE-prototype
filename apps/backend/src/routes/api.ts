import { type Request,
         type Response,
         Router
} from "express"
import { requireAuth, getAuth, clerkClient } from '@clerk/express'
import { prisma } from '../lib/prisma'
import { createSupabaseForRequest } from '../lib/supabase'
import { type IFile,
         Status
} from './types.ts'

const APIRouter = Router()

APIRouter.get('/me', requireAuth(), async (req, res) => {
  
    // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId as string)

//   prisma.employee.create({
//     data: {
//             first_name: employee.first_name,
//             last_name: employee.last_name,
//             uname: employee.uname,
//             email: employee.email,
//           }
//   })

  return res.json({ user })
})