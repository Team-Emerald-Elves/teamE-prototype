
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

/*

model Employee {
  id          String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  clerkUserId String      @db.Uuid
  uname       String      @unique @default("uname")
  first_name  String      @default("fname")
  last_name   String      @default("lname")
  roles       String[]
  email       String?     @unique
  contents    FileContent[]
  bucket     BucketMeta?
}

model BucketMeta {
  id                 String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  public             Boolean   @default(false)
  type               String    @default("STANDARD")
  file_size_limit    Int       @default(10485760)
  allowed_mime_types String[]  @default([])
  created_at         DateTime  @default(now())
  updated_at         DateTime  @updatedAt

  employeeId         String    @unique @db.Uuid
  employee           Employee  @relation(fields: [employeeId], references: [id])
}

model FileContent {
  id              Int      @id @default(autoincrement())
  name            String
  employeeId      String   @db.Uuid
  content_owner   Employee @relation(fields: [employeeId], references: [id])
  last_modified   DateTime @updatedAt
  expiration_date DateTime
  mime_type    String   @default("text/plain")
  document_status Status   @default(not_started)
}

*/

// type documentStatus = 'not_started' |
//                       'started' |
//                       'in_progress' |
//                       'needs_review' |
//                       'done' |
//                       'expired'

// type IFile = {
//     fileName: string
//     fileContent: {
//         name: string
//         URL?: string
//         content_owner: string
//         job_position: string
//         expiration_date?: Date
//         content_type?: string
//         documment_status?: documentStatus
//     }
//     filePayload: File
// }

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
                .from(employee.bucket!.id).update((fileName as string).trim(), fileData)

            if (!data || error) {
                throw new Error(`Failed to modify file '${fileName}' for user '${employee.uname}'.`)
            }

        } catch (error) {
            res.status(401).json(`{"message":"Error modifying file in bucket: ${error}"}`)
        }
    }
)


export default supaBaseRouter