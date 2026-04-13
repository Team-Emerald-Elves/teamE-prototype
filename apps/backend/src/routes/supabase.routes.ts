
import { Router, type Request, type Response } from 'express'
import { getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma.ts'
import { createSupabaseForRequest } from '../lib/supabase.ts'
import type { documentContent, Roles, UserRoles } from './types.d.ts'

const supaBaseRouter = Router()

// const clerkClient = createClerkClient({
//     secretKey: process.env.CLERK_SECRET_KEY
// })


supaBaseRouter.post(
    "/create-document",
    //requireAuth(),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req)
        console.log(userId)
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }
    const document: documentContent = req.body
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

        // Create contents for document.

        const expirationDate = new Date(document.documentContent.expiration_date as string)

        const documentContents = await prisma.documentContent.create({
            data: {
                name: document.documentContent.name,
                url: document.documentContent.URL ?? "Local upload",
                content_owner: document.documentContent.content_owner,
                assigned_role: document.documentContent.assigned_role,
                bucketId: employee.bucket!.id,
                mime_type: document.documentContent.mime_type ?? "text/plain",
                expiration_date: !isNaN(expirationDate.getTime()) ? expirationDate.toISOString() : new Date(Date.now() + 1),
                document_status: "not_started",
                document_type: document.documentContent.document_type ?? "Reference"

            }
        })

        if (documentContents.url === "Local upload")
        {
            // Upload document to authenticated employee with supabase bucket association.
            const { data, error } = await supabaseClient.storage
            .from(employee.bucket!.id)
            .upload((document.documentContent.name as string).trim(), document.filePayload as File)

            if (!data || error) {
                throw new Error(`Failed to upload document '${document.documentContent.name}' for user '${employee.uname}'.`)
            }

        } else {
            // Implement downloading a document from the URL passed.
        }

    } catch (error)
    {
        res.status(401).json(`{"message":"Error creating document in bucket: ${error}"}`)
    }
})

supaBaseRouter.delete(
    '/delete-document',
    // requireAuth(),
    async (req: Request, res: Response) => {
        
        const { userId, isAuthenticated } = getAuth(req)
        const document: documentContent = req.body
        const supabaseClient = await createSupabaseForRequest()

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
        //"user_3C3ncrap2QXGCwsShh9R0TCTVTF"
        // Find existing content for document.
        prisma.documentContent.delete({
            where: {
                id: document.documentID
            },
        }).catch((error) => {
            throw new Error("Couldn't delete document meta infomation.")
        })

        const { data, error } = await supabaseClient.storage
            .from(employee.bucket!.id).remove([(document.documentContent.name as string).trim()])

        if (!data || error) {
            throw new Error(`Failed to delete document '${document.documentContent.name}' for user '${employee.uname}'.`)
        }

    } catch (error) {
        res.status(401).json(`{"message":"Error deleting document in bucket: ${error}"}`)
    }
})

supaBaseRouter.put(
    '/update-document',
    // requireAuth(),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req)

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }
        console.log(userId)
        const document: documentContent = req.body
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

            // // Find existing content for document.
            // const existingdocumentContent = await prisma.documentContent.findFirstOrThrow({
            //     where: {
            //         bucketId: employee.bucket?.id,
            //         name: document.documentContent.name
            //     },
            // })

            // Update contents for document.
            await prisma.documentContent.update({
                where: {
                    id: document.documentID,
                },
                data: {
                    name: document.documentContent.name,
                    url: document.documentContent.URL ?? "Local upload",
                    content_owner: document.documentContent.content_owner,
                    assigned_role: document.documentContent.assigned_role,
                    bucketId: employee.bucket!.id,
                    mime_type: document.documentContent.mime_type ?? "text/plain",
                    expiration_date: document.documentContent.expiration_date,
                    document_type: document.documentContent.document_type
                }
            })

            const {data, error} = await supabaseClient.storage
                .from(employee.bucket!.id).update((document.documentContent.name as string).trim(), document.filePayload as File)

            if (!data || error) {
                throw new Error(`Failed to modify document '${document.documentContent.name}' for user '${employee.uname}'.`)
            }

        } catch (error) {
            console.error("Update document error:", error);

            res.status(500).json({
                message: "Error modifying document",
                error: String(error),
            });
        }
    }
)

supaBaseRouter.get(
    '/list-documents',
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

            const documents = await prisma.documentContent.findMany({
                where: {
                    assigned_role: {
                        in: employee.roles
                    }
                }
            })
            res.status(200).json(documents)
        } catch(error) {
            res.status(404).json(`{"message":"Failed to find employee: ${error}"}`)
        }
    }
)

export default supaBaseRouter