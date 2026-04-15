import express from "express";
import prisma, {type ServiceRequests} from "@repo/database"

function serviceReqRoute(req: express.Request, res: express.Response) {
    prisma.serviceRequests.findMany({
        orderBy: {
            created_at: "asc"
        }
    }).then((data: ServiceRequests) => {
        res.json(data)
    }).catch((err: any) => {
        console.log("Error: ", err)
    })
}

export default serviceReqRoute;