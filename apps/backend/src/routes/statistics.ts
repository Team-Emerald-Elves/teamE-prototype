import express from "express";
import {prisma} from "../lib/prisma.ts";


async function statsRoutes(req: express.Request, res: express.Response) {
    try {
        const [docCount, employees] = await Promise.all([
            prisma.documentContent.count(),
            prisma.employee.findMany({ select: { roles: true } })
        ])
        const empCount = employees.length
        const underwriterCount = employees.filter(e => e.roles.includes("UnderWriter")).length
        const analystCount = employees.filter(e => e.roles.includes("BusinessAnalyst")).length
        return res.status(200).json({docCount, empCount, underwriterCount, analystCount})
    } catch(error){
        console.error("Failed to get data", error)
        return res.status(500).json(`{"message":"Failed to get data"}`)
    }
}

export default statsRoutes;