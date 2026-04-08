import e, { Router,
         type Request,
         type Response 
        } from 'express'
import { requireAuth, getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma'
import { createSupabaseForRequest } from '../lib/supabase'
import type { Employee } from '../../prisma/generated/client'

const supaBaseRouter = Router()
const supabaseClient = await createSupabaseForRequest() // Create one instance of supabase client to be used for user requests.

supaBaseRouter.get("/create-file", requireAuth(), async (req: Request, res: Response) => {
    const { userId } = getAuth(req)
    const { fileName, fileData } = req.body
    try {

        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId as string
            },
            include: {
                bucket: true
            }
        })

        const { data, error } = await supabaseClient.storage
        .from(employee.bucket!.name)
        .upload((fileName as string).trim(), fileData)

        if (!data || error) {
            throw new Error(`Failed to upload file '${fileName}' for user '${employee.uname}'.`)
        }

    } catch (error)
    {
        res.status(401).json(`{"message":"Error creating file in bucket: ${error}"}`)
    }
})



export default supaBaseRouter