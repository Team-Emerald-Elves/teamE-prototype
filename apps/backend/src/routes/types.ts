export enum Status {
    not_started,
    started,
    in_progress,
    needs_review,
    done,
    expired
}

export type IFile = {
    fileName: string
    fileContent: {
        name: string
        URL?: string
        content_owner: string
        expiration_date?: Date | string
        mime_type?: string
        documment_status?: Status
    }
    filePayload: File
}