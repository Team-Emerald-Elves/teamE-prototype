export { Roles, UserRoles } from '../../prisma/generated/client.ts'
import { Status } from '../../prisma/generated/client.ts'
import type { documentContent as DocumentContent } from '../../prisma/generated/client.ts'

export type IDocumentContent = DocumentContent & {
  documentID: number
  filePayload?: File
}