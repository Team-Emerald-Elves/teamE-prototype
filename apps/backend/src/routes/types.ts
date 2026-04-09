export type Status = {
    not_started: 0,
    started: 1,
    in_progress: 2,
    needs_review: 3,
    done: 4,
    expired: 5
}

export type IFile = {
    fileName: string
    fileID: number
    fileContent: {
        name: string
        URL?: string
        content_owner: string
        expiration_date?: Date | string
        mime_type?: string
        documment_status?: Status
    }
    filePayload: File | string
}