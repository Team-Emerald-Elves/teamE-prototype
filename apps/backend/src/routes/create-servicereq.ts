import express from "express";
import {prisma} from "../lib/prisma.ts";

interface IServiceRequestCreator {
    uname?: string;
    description: string;
}

function createServiceReqRoute(req: express.Request, res: express.Response) {
    let svReq: IServiceRequestCreator = req.body
    prisma.serviceRequests.create({
        data: {
            description: svReq.description,
        }
    }).then((result) => {
        console.log("Successfully created service request");
        res.sendStatus(200); // Success
    }, (err) => {
        console.error(`[ERROR] Failed to creat employee with error: ${err}`);
        res.sendStatus(500); // Failed
    })
}

export default createServiceReqRoute;