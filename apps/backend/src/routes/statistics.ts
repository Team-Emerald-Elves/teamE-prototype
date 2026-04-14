import express from "express";
import {prisma} from "../lib/prisma.ts";


async function statsRoutes(req: express.Request, res: express.Response) {
    try {
        const [docCount, empCount, docByStatus] = await Promise.all([
            prisma.documentContent.count(),
            prisma.employee.count(),
            prisma.documentContent.groupBy({ //group doc content by status
                by: ['document_status'],
                _count: { id: true } // num rows per group
            }),
        ])
        return res.status(200).json({docCount, empCount, docByStatus})
    } catch(error){
        console.error("Failed to get data", error)
        return res.status(500).json(`{"message":"Failed to get data"}`)
    }
}

export default statsRoutes;