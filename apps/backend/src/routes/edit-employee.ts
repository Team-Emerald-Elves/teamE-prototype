import express from "express";
import {prisma} from "../lib/prisma.ts";
import {type Employee} from "../lib/prismadefs.ts"

interface IEditEmployeeRequest {
    id: string;
    uname: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    roles: string[] | undefined;
    email: string | undefined;
}

async function editEmployeeRoute(req: express.Request, res: express.Response) {
    const ereq: IEditEmployeeRequest = req.body as IEditEmployeeRequest;

    const employee: Employee = await prisma.employee.update({
        where: {
            id: ereq.id,
        },
        data: ereq,
    });

    res.status(200).send(employee);
}

export default editEmployeeRoute;