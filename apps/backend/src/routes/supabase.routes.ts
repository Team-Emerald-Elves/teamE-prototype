<<<<<<< HEAD
import { Router,
         type Request,
         type Response
=======
import e, { Router,
         type Request,
         type Response 
>>>>>>> 8e998fe ((routes): supabase file creation.)
        } from 'express'
import { requireAuth, getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma'
import { createSupabaseForRequest } from '../lib/supabase'
<<<<<<< HEAD
=======
import type { Employee } from '../../prisma/generated/client'
>>>>>>> 8e998fe ((routes): supabase file creation.)

const supaBaseRouter = Router()
const supabaseClient = await createSupabaseForRequest() // Create one instance of supabase client to be used for user requests.

<<<<<<< HEAD
supaBaseRouter.get(
    "/create-file",
    requireAuth(),
    async (req: Request, res: Response) => {

=======
supaBaseRouter.get("/create-file", requireAuth(), async (req: Request, res: Response) => {
>>>>>>> 8e998fe ((routes): supabase file creation.)
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

<<<<<<< HEAD
supaBaseRouter.get(
    '/delete-file',
    requireAuth(),
    async (req: Request, res: Response) => {
        const { userId } = getAuth(req)
        const {fileName} = req.body
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
            .from(employee.bucket!.name).remove([(fileName as string).trim()])

        if (!data || error) {
            throw new Error(`Failed to delete file '${fileName}' for user '${employee.uname}'.`)
        }

    } catch (error) {
        res.status(401).json(`{"message":"Error deleting file in bucket: ${error}"}`)
    }
})

supaBaseRouter.get(
    '/update-file',
    requireAuth(),
    async (req: Request, res: Response) => {
        const {userId} = getAuth(req)
        const {fileName, fileData} = req.body
        try {
            const employee = await prisma.employee.findFirstOrThrow({
                where: {
                    clerkUserId: userId as string
                },
                include: {
                    bucket: true
                }
            })
            const {data, error} = await supabaseClient.storage
                .from(employee.bucket!.name).update((fileName as string).trim(), fileData)

            if (!data || error) {
                throw new Error(`Failed to modify file '${fileName}' for user '${employee.uname}'.`)
            }

        } catch (error) {
            res.status(401).json(`{"message":"Error modifying file in bucket: ${error}"}`)
        }
    }
)
=======
>>>>>>> 8e998fe ((routes): supabase file creation.)


export default supaBaseRouter