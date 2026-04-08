import {
         Router
} from "express"
import { requireAuth, getAuth, clerkClient } from '@clerk/express'


const APIRouter = Router()

APIRouter.get('/me', requireAuth(), async (req, res) => {
  
    // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId as string)

<<<<<<< Updated upstream
//   prisma.employee.create({
//     data: {
//             first_name: employee.first_name,
//             last_name: employee.last_name,
//             uname: employee.uname,
//             email: employee.email,
//           }
//   })

  return res.status(200).json( user )
=======
  return res.status(200).json()
>>>>>>> Stashed changes
})

export default APIRouter