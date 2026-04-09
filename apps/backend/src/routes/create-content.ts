import express from "express";
import { prisma } from "../lib/prisma.ts";

interface IContentCreator {
    name: string;
    url: string;
    bucket: string;
    expiration_date: string;
    content_type?: string;
    document_status?: string;
    employeeId: string;
    mime_type?: string;
}

function createContentRoute(req: express.Request, res: express.Response) {
    const content: IContentCreator = req.body as IContentCreator;
    prisma.fileContent
        .create({
            data: {
                name: content.name,
                url: content.url,
                bucket: content.bucket,
                expiration_date: new Date(content.expiration_date),
                content_type: content.content_type,
                mime_type: content.mime_type,
                content_owner: {
                    connect: { id: content.employeeId },
                },
            },
        })
        .then(
            (result) => {
                console.log(`Successfully created content: ${result.name}`);
                res.sendStatus(200);
            },
            (err) => {
                console.error(`[ERROR] Failed to create content with error: ${err}`);
                res.sendStatus(500);
            }
        );
}

export default createContentRoute;