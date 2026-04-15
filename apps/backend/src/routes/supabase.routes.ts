
import { Router, type Request, type Response } from 'express'
import { requireAuth, getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma.ts'
import { createSupabaseForRequest } from '../lib/supabase.ts'
import type { IDocumentContent } from './types.d.ts'
import {Status, UserRoles } from '../../prisma/generated/client.ts'

const supaBaseRouter = Router()

// const clerkClient = createClerkClient({
//     secretKey: process.env.CLERK_SECRET_KEY
// })

function toExpirationDate(value: unknown): Date {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}

supaBaseRouter.post(
    "/create-document",
    //requireAuth(),
    async (req: Request, res: Response) => {

        const { userId, isAuthenticated } = getAuth(req)
        console.log("Uid: ", userId);
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }
        const document: IDocumentContent = req.body
        console.log("Payload: ", document.filePayload);
        const supabaseClient = await createSupabaseForRequest();
    console.log("Document: ", document)
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

        const expirationDate = toExpirationDate(document.expiration_date)
        const documentStatus = Object.values(Status).includes(document.document_status as Status)
        ? (document.document_status as Status)
        : Status.not_started
        const assignedRole = Object.values(UserRoles).includes(document.assigned_role as UserRoles)
        ? (document.assigned_role as UserRoles)
        : UserRoles.UnderWriter

        const documentContents = await prisma.documentContent.create({
            data: {
                name: document.name ?? "Not found.",
                url: document.url ?? "Local upload",
                content_owner: document.content_owner ?? "Not Found.",
                assigned_role: assignedRole,
                bucketId: employee.bucket!.id,
                mime_type: document.mime_type ?? "text/plain",
                expiration_date: expirationDate.toISOString(),
                document_status: documentStatus,
                document_type: document.document_type ?? "Reference"

            }
        })
        const decoded = Buffer.from(document.filePayload as string, 'base64');
        const payload: File = new File([decoded], document.name)

        // Upload document to authenticated employee with supabase bucket association.
        const { data, error } = await supabaseClient.storage
            .from(employee.bucket!.id)
            .upload((document.url as string).trim(), payload)

        if (!data || error) {
            throw new Error(`Failed to upload document '${document.name}' for user '${employee.uname}'.`)
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
        const document: IDocumentContent = req.body
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

        prisma.documentContent.findFirst({
            where: {
                id: document.id
            }
        }).then( async (d) => {
            const { data, error } = await supabaseClient.storage
            .from(employee.bucket!.id).remove([(d?.name as string).trim()])

            if (!data || error) {
                console.error(`Failed to delete document '${document.name}' for user '${employee.uname}'.`)
            }
        }).catch(error => {
            console.error("No bucket associated with employee: " + error)
        })

        
        // delete existing content for document.
        await prisma.documentContent.delete({
            where: {
                id: document.id
            },
        }).catch((error) => {
            console.error("Couldn't delete document meta infomation.")
        })

        res.sendStatus(200)

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
        console.log("Uid: ", userId);
        const document: IDocumentContent = req.body
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

            // Update contents for document.
            const newDoc = await prisma.documentContent.update({
                where: {
                    id: document.id,
                },
                data: {
                    name: document.name ?? "Not found.",
                    url: document.url ?? "Local upload",
                    content_owner: document.content_owner ?? "Not Found.",
                    assigned_role: document.assigned_role ?? UserRoles.UnderWriter,
                    bucketId: employee.bucket!.id,
                    mime_type: document.mime_type ?? "text/plain",
                    expiration_date: toExpirationDate(document.expiration_date).toISOString(),
                    document_status: document.document_status,
                    document_type: document.document_type ?? "Reference"
                }
            })

            console.log("New doc created: ", newDoc);

            const {data, error} = await supabaseClient.storage
                .from(employee.bucket!.id).update((document.name as string).trim(), document.filePayload as string)

            if (!data || error) {
                throw new Error(`Failed to modify document '${document.name}' for user '${employee.uname}'.`)
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

supaBaseRouter.get('/list-documents', async (req: Request, res: Response) => {
    const { isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const documents = await prisma.documentContent.findMany();

        const ownerIds = [...new Set(documents.map(doc => doc.content_owner))];

        const employees = await prisma.employee.findMany({
            where: {
                id: { in: ownerIds },
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
            },
        });

        const employeeMap = new Map(
            employees.map(emp => [
                emp.id,
                `${emp.first_name} ${emp.last_name}`
            ])
        );

        const formattedDocs = documents.map(doc => ({
            ...doc,
            content_owner: employeeMap.get(doc.content_owner) || "Unknown",
        }));

        res.status(200).json(formattedDocs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
});


supaBaseRouter.get(
    '/download-document',
    //requireAuth(),
    async (req: Request, res: Response) => {
        const {userId, isAuthenticated} = getAuth(req)
        const document: documentContent = req.body
        const supabaseClient = await createSupabaseForRequest()
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

            const { data, error } = await supabaseClient.storage
                .from(employee.bucket!.id).download((document.documentContent.name as string).trim())

            if (!data || error) {
                throw new Error(`Failed to download document '${document.documentContent.name}' for user '${employee.uname}'.`)
            }
        } catch (error) {
            console.error("Download document error:", error);

            res.status(500).json({
                message: "Error downloading document",
                error: String(error),
            });
        }
    }

)

export default supaBaseRouter