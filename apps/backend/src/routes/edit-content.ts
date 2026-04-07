import express from "express";
import {prisma} from "../lib/prisma.ts";

interface IContentEditor {
    id:number;
    name?: string;
    URL?: string;
    job_position?: string;
    content_owner?: string;
    expiration_date?: string;
    content_type?: string;
    document_status?: string;
    employeeId?: string;
}
function updatecontentRoute(req: express.Request, res: express.Response) {
    let content: IContentEditor = req.body
    prisma.content.update({
        where: {
            id: content.id,
        },
        data: {
        ...(content.URL && {URL: content.URL})

        },
    });
}