import express from "express";
import prisma from "@repo/database";


async function statsRoutes(req: express.Request, res: express.Response) {
    try {
        const [docCount, employees, documents] = await Promise.all([
            prisma.documentContent.count(),
            prisma.employee.findMany({ select: { roles: true } }),
            prisma.documentContent.findMany()
        ])
        const empCount = employees.length
        const underwriterCount = employees.filter((e) => e.roles.includes("UnderWriter")).length
        const analystCount = employees.filter((e) => e.roles.includes("BusinessAnalyst")).length
        const busOpCount = employees.filter((e) => e.roles.includes("BusinessOperator")).length
        const exOpCount = employees.filter((e) => e.roles.includes("ExcelOperator")).length
        const acCount = employees.filter((e) => e.roles.includes("ActuarialAnalyst")).length
        const adminCount = employees.filter((e) => e.roles.includes("Administrator")).length

        const statusCounts = {
            not_started: 0,
            in_progress: 0,
            needs_review: 0,
            done: 0,
            expired: 0,
        };

        const typeCounts = {
            reference: 0,
            workflow: 0,
        };

        for (const doc of documents) {
            if (doc.document_status) {
                statusCounts[doc.document_status]++;
            }

            const type = doc.document_type?.toLowerCase();
            if (type === "reference") typeCounts.reference++;
            if (type === "workflow") typeCounts.workflow++;
        }

        return res.status(200).json({docCount, empCount, underwriterCount, analystCount, busOpCount, exOpCount, acCount, adminCount, statusCounts, typeCounts})
    } catch(error){
        console.error("Failed to get data", error)
        return res.status(500).json(`{"message":"Failed to get data"}`)
    }
}

export default statsRoutes;