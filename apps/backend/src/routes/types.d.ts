export {
    Roles,
    UserRoles,
    Status,
    documentContent as DocumentContent,
} from "@repo/database";

export type IDocumentContent = DocumentContent & {
    documentID: number;
    filePayload?: string;
    fileName?: string;
};
