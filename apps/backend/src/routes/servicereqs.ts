import express from "express";
import { prisma } from "../lib/prisma.ts"

interface IServiceRequest {
    id?: number;
    created_at?: number;
    assigned_at?: string;
    assigned_id?: string;
    creator_id?: string;
    description: string;
}

function serviceReqRoute(req: express.Request, res: express.Response) {
    prisma.serviceRequests.findMany({
        orderBy: {
            created_at: "asc"
        }
    }).then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

export default serviceReqRoute;