import express from "express";
import {prisma} from "../lib/prisma.ts";


async function statsRoutes(req: express.Request, res: express.Response) {
    try {
        const [docCount, empCount] = await Promise.all([
            prisma.documentContent.count(),
            prisma.employee.count(),
        ])
        return res.status(200).json({docCount, empCount})
    } catch(error){
        console.error("Failed to get data", error)
        return res.status(500).json(`{"message":"Failed to get data"}`)
    }
}

export default statsRoutes;