
import { Router, type Request, type Response } from 'express'
import { getAuth } from '@clerk/express'
import prisma, { Status,
                 UserRoles,
                 type documentContent,
} from '@repo/database'
import { createSupabaseForRequest } from '../lib/supabase.ts'
import type { IDocumentContent } from './types.d.ts'

import { DocumentContentModel } from '../lib/zod/routes.schemas.ts';
import { validate } from '../lib/zod/middleware.ts';

const supaBaseRouter = Router()

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

async function getMimeFromUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    // The server tells you exactly what the file is
    return response.headers.get('Content-Type');
  } catch (error) {
    console.error("Failed to fetch headers:", error);
    return null;
  }
}

supaBaseRouter.post(
    "/create-document",
    validate(DocumentContentModel),
    //requireAuth(),
    async (req: Request, res: Response) => {

        const { userId, isAuthenticated } = getAuth(req)
        console.log("Uid: ", userId);
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }
        const document: IDocumentContent = req.body
        const supabaseClient = await createSupabaseForRequest();

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


            let mime_type: string

            if (!document.filePayload) {
                console.log('Document source file is streamed.')
                mime_type = await getMimeFromUrl(document.url as string) ?? "text/plain"
            } else {
                console.log('Document source file is being uploaded.')
                const decoded = Buffer.from(document.filePayload as string, 'base64');
                const payload: File = new File([decoded], document.name)
                mime_type = payload.type

                // Upload document to authenticated employee with supabase bucket association.
                const { data, error } = await supabaseClient.storage
                    .from(employee.bucket!.id)
                    .upload((document.url as string).trim(), payload)

                if (!data || error) {
                    throw new Error(`Failed to upload document '${document.name}' for user '${employee.uname}'.`)
                }
            }
            
            const documentContents = await prisma.documentContent.create({
                data: {
                    name: document.name ?? "Not found.",
                    url: document.url ?? "Local upload",
                    content_owner: document.content_owner ?? "Not Found.",
                    assigned_role: assignedRole,
                    bucketId: employee.bucket!.id,
                    mime_type: mime_type,
                    expiration_date: expirationDate.toISOString(),
                    document_status: documentStatus,
                    document_type: document.document_type ?? "Reference"

                }
            })

            await prisma.calendarEvents.create({
                data: {
                    title: documentContents.name,
                    start_date: new Date(),
                    end_date: documentContents.expiration_date,
                    all_day: false,
                    emp_id: null,
                    lock: "none",
                    doc_id: documentContents.id
                }
            })

    } catch (error)
    {
        res.status(401).json(`{"message":"Error creating document in bucket: ${error}"}`)
    }
})

supaBaseRouter.delete(
    '/delete-document',
    validate(DocumentContentModel),
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

        const event = await prisma.calendarEvents.findFirstOrThrow({
            where: {
                doc_id: document.id
            }
        })

        await prisma.calendarEvents.delete({
            where: {
                id: event.id
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
        }).catch((error: any) => {
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
    validate(DocumentContentModel),
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
            const event = await prisma.calendarEvents.findFirstOrThrow({
                where: {
                    doc_id: document.id
                }
            })
            await prisma.calendarEvents.update({
                where: {
                    id: event.id
                },
                data: {
                    title: newDoc.name,
                    end_date: newDoc.expiration_date,
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
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        // get employee for favorites
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId,
            },
            select: {
                favorites: true,
            },
        });

        const favoriteSet = new Set(employee.favorites);

        // get all documents
        const documents = await prisma.documentContent.findMany();

        const ownerIds = [...new Set(documents.map((doc: documentContent) => doc.content_owner))];

        const employees = await prisma.employee.findMany({
            where: {
                id: { in: ownerIds as string[] },
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
            },
        });

        const employeeMap = new Map(
            employees.map((emp) => [
                emp.id,
                `${emp.first_name} ${emp.last_name}`,
            ])
        );

        const formattedDocs = documents.map((doc) => ({
            ...doc,
            content_owner: employeeMap.get(doc.content_owner as string) || "Unknown",
        }));

        //sort so favorites appear first
        const sortedDocs = formattedDocs.sort((a, b) => {
            // favorites first
            if (a.favorite === b.favorite) return 0;
            return a.favorite ? -1 : 1;
        });

        res.status(200).json(sortedDocs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
});

export default supaBaseRouter