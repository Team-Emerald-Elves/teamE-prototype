
import { Router,
         type Request,
         type Response
} from 'express'
import { requireAuth, getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma'
import { createSupabaseForRequest } from '../lib/supabase'
import { type IFile,
         Status
} from './types.ts'

const supaBaseRouter = Router()
const supabaseClient = await createSupabaseForRequest() // Create one instance of supabase client to be used for user requests.

supaBaseRouter.get(
    "/create-file",
    requireAuth(),
    async (req: Request, res: Response) => {
    const { userId } = getAuth(req)
    const file: IFile = req.body
    try {

        // Get the authenticated employee.
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId as string
            },
            include: {
                bucket: true
            }
        })

        // Create content for file
        await prisma.fileContent.create({
            data: {
                name: file.fileName,
                bucketId: employee.bucket!.id,
                mime_type: file.fileContent.mime_type ?? "text/plain",
                expiration_date: file.fileContent.expiration_date ?? new Date().setDate(Date.now() + 1).toString()
            }
        })

        // Upload file to authenticated employee with supabase bucket association.
        const { data, error } = await supabaseClient.storage
        .from(employee.bucket!.id)
        .upload((file.fileName as string).trim(), file.filePayload)

        if (!data || error) {
            throw new Error(`Failed to upload file '${file.fileName}' for user '${employee.uname}'.`)
        }

    } catch (error)
    {
        res.status(401).json(`{"message":"Error creating file in bucket: ${error}"}`)
    }
})

supaBaseRouter.delete(
    '/delete-file',
    requireAuth(),
    async (req: Request, res: Response) => {
        const { userId } = getAuth(req)
        const { fileName } = req.body
    try {
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId as string
            },
            include: {
                bucket: true
            }
        })

        // Find existing content for file.
        prisma.fileContent.delete({
            where: {
                bucketId: employee.bucket?.id,
                name: fileName
            },
        }).catch((error) => {
            throw new Error("Couldn't delete file meta infomation.")
        })

        const { data, error } = await supabaseClient.storage
            .from(employee.bucket!.id).remove([(fileName as string).trim()])

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
        const file: IFile = req.body
        
        try {
            const employee = await prisma.employee.findFirstOrThrow({
                where: {
                    clerkUserId: userId as string
                },
                include: {
                    bucket: true
                }
            })

            // Find existing content for file.
            const existingFileContent = await prisma.fileContent.findFirstOrThrow({
                where: {
                    bucketId: employee.bucket?.id,
                    name: file.fileName
                },
            })

            // Update contents for file.
            await prisma.fileContent.update({
                where: {
                    id: existingFileContent?.id,
                },
                data: {
                    ...file,
                    bucketId: employee.bucket?.id,
                },
            })

            const {data, error} = await supabaseClient.storage
                .from(employee.bucket!.id).update((file.fileName as string).trim(), file.filePayload)

            if (!data || error) {
                throw new Error(`Failed to modify file '${file.fileName}' for user '${employee.uname}'.`)
            }

        } catch (error) {
            res.status(401).json(`{"message":"Error modifying file in bucket: ${error}"}`)
        }
    }
)

export default supaBaseRouter