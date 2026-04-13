export { Roles, UserRoles } from '../../prisma/generated/client.ts'

export type Status = {
    not_started: 0,
    started: 1,
    in_progress: 2,
    needs_review: 3,
    done: 4,
    expired: 5
}

                        // <ContentForm
                        //     type="Create"
                        //     currentName="Name..."
                        //     currentURL="www.example.com"
                        //     currentContentOwner="Select Content Owner"
                        //     currentRole="Select Role"
                        //     currentExpirationDate={undefined}
                        //     currentExpirationTime="10:30:00"
                        //     currentStatus="Select Status"
                        //     size={true}
                        // />

export type documentContent = {
    documentContent: {
        name: string
        URL?: string
        content_owner: string
        assigned_role: Roles
        expiration_date?: Date | string
        document_type?: string
        document_status?: Status
        mime_type?: string
    }
    documentID: number
    filePayload?: File
}