import express from "express";
import {prisma} from "../lib/prisma.ts";
import {type Employee} from "../lib/prismadefs.ts"

interface IEditEmployeeRequest {
    id: string;
    uname?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
    email?: string;
}

async function editEmployeeRoute(req: express.Request, res: express.Response) {
    const ereq: IEditEmployeeRequest = req.body as IEditEmployeeRequest;

    const employee: Employee = await prisma.employee.update({
        where: {
            id: ereq.id,
        },
        data: {
            last_name: ereq.lastName!
        }
    });

    res.status(200).send(employee);
}

export default editEmployeeRoute;