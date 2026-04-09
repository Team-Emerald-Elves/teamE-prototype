
import { Router, type Request, type Response } from 'express'
import { getAuth, createClerkClient } from '@clerk/express'
import { prisma } from '../lib/prisma.ts'
import { createSupabaseForRequest } from '../lib/supabase.ts'
import { type IFile } from './types.ts'

const supaBaseRouter = Router()

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
})


supaBaseRouter.post(
    "/create-file",
    //requireAuth(),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req)
        console.log(userId)
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }
    const file: IFile = req.body
    const supabaseClient = await createSupabaseForRequest()

    try {
        // Get the authenticated employee.
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId
            },
            include: {
                bucket: true
            }
        })

        // Create content for file
        const fileContents = await prisma.fileContent.create({
            data: {
                name: file.fileName,
                url: file.fileContent.URL ?? "Local upload",
                bucketId: employee.bucket!.id,
                mime_type: file.fileContent.mime_type ?? "text/plain",
                expiration_date: "2026-04-18T00:00:00.000Z"
            }
        })

        if (fileContents.url === "Local upload")
        {
            // Upload file to authenticated employee with supabase bucket association.
            const { data, error } = await supabaseClient.storage
            .from(employee.bucket!.id)
            .upload((file.fileName as string).trim(), file.filePayload)

            if (!data || error) {
                throw new Error(`Failed to upload file '${file.fileName}' for user '${employee.uname}'.`)
            }

        } else {
            // Implement downloading a file from the URL passed.
        }

    } catch (error)
    {
        res.status(401).json(`{"message":"Error creating file in bucket: ${error}"}`)
    }
})

supaBaseRouter.delete(
    '/delete-file',
    // requireAuth(),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req)
        console.log(userId)
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }
        const { fileName } = req.body
        const supabaseClient = await createSupabaseForRequest()
    try {
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId
            },
            include: {
                bucket: true
            }
        })
        //"user_3C3ncrap2QXGCwsShh9R0TCTVTF"
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

supaBaseRouter.put(
    '/update-file',
    // requireAuth(),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req)

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }
        console.log(userId)
        const file: IFile = req.body
        const supabaseClient = await createSupabaseForRequest()

        try {
            const employee = await prisma.employee.findFirstOrThrow({
                where: {
                    clerkUserId: userId
                },
                include: {
                    bucket: true
                }
            })

            // // Find existing content for file.
            // const existingFileContent = await prisma.fileContent.findFirstOrThrow({
            //     where: {
            //         bucketId: employee.bucket?.id,
            //         name: file.fileName
            //     },
            // })

            // Update contents for file.
            await prisma.fileContent.update({
                where: {
                    id: file.fileID,
                },
                data: {
                        name: file.fileName,
                        mime_type: file.fileContent.mime_type ?? "text/plain",
                        url: file.fileContent.URL ?? "Local upload",
                        expiration_date: new Date(file.fileContent.expiration_date ?? "2026-04-18"),
                        bucketId: employee.bucket!.id,
                },
            })

            const {data, error} = await supabaseClient.storage
                .from(employee.bucket!.id).update((file.fileName as string).trim(), file.filePayload)

            if (!data || error) {
                throw new Error(`Failed to modify file '${file.fileName}' for user '${employee.uname}'.`)
            }

        } catch (error) {
            console.error("Update file error:", error);

            res.status(500).json({
                message: "Error modifying file",
                error: String(error),
            });
        }
    }
)

supaBaseRouter.get(
    '/list-files',
    //requireAuth(),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req)
        console.log(userId)
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }

        try {
            const employee = await prisma.employee.findFirstOrThrow({
                where: {
                    clerkUserId: userId
                },
                include: {
                    bucket: true
                }
            })
            const files = await prisma.fileContent.findMany({
                where: {
                    bucketId: employee.bucket?.id
                }
            })

            res.status(200).json(files)

        } catch(error) {
            res.status(404).json(`{"message":"Failed to find employee: ${error}"}`)
        }
    }
)

export default supaBaseRouter